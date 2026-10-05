/*
    Copyright (C) 2026 Jakub Březa

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://gnu.org>.
*/

/**
 * ==============================================================================
 * QuizApp v4 Pro - Produkční logika (Referenční řešení)
 * Témata: Persistence dat pomocí Cookies API (setCookie, getCookie), Osobní rekord
 * (High Score), Životní cyklus aplikace, Oslavné animace a Produkční refaktoring
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. Pomocné matematické funkce
// ------------------------------------------------------------------------------

/**
 * Generuje náhodné celé číslo v intervalu [min, max] včetně obou mezí.
 * @param {number} min - Minimální hodnota.
 * @param {number} max - Maximální hodnota.
 * @returns {number} Náhodné celé číslo.
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Náhodně promíchá kopii pole pomocí Fisher-Yates (Knuth) shuffle algoritmu.
 * Nemodifikuje původní pole (Pure Function).
 * @template T
 * @param {T[]} array - Vstupní pole.
 * @returns {T[]} Nové promíchané pole.
 */
function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Spočte úspěšnost v procentech zaokrouhlenou na celá čísla.
 * @param {number} correct - Počet správných odpovědí.
 * @param {number} total - Celkový počet otázek.
 * @returns {number} Procentuální úspěšnost (0-100).
 */
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

// ------------------------------------------------------------------------------
// 2. JavaScript Cookies API – Pomocné metody pro persistenci dat
// ------------------------------------------------------------------------------

/**
 * Uloží hodnotu do cookie prohlížeče s definovanou dobou platnosti a moderními bezpečnostními atributy.
 * @param {string} name - Název klíče cookie.
 * @param {string|number} value - Ukládaná hodnota.
 * @param {number} [days=30] - Počet dní platnosti cookie.
 */
function setCookie(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

/**
 * Načte hodnotu cookie podle jejího klíče.
 * Pokud klíč neexistuje, vrací null.
 * @param {string} name - Název hledaného klíče.
 * @returns {string|null} Hodnota cookie nebo null.
 */
function getCookie(name) {
    const allCookies = document.cookie;
    if (!allCookies) return null;

    const cookieArray = allCookies.split(';');
    const encodedName = encodeURIComponent(name) + '=';

    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.startsWith(encodedName)) {
            return decodeURIComponent(cookie.substring(encodedName.length));
        }
    }

    return null;
}

// ------------------------------------------------------------------------------
// 3. Zásobník otázek (Data Pool)
// ------------------------------------------------------------------------------
const QUESTIONS_POOL = [
    {
        text: 'Která vlastnost v JavaScriptu slouží k ukládání a čtení cookies v prohlížeči?',
        options: ['document.cookie', 'window.storage', 'navigator.cookie', 'document.session'],
        correctIndex: 0
    },
    {
        text: 'Jaký atribut cookie určuje cestu URL, pro kterou je cookie platná?',
        options: ['path=/', 'domain=/', 'route=/', 'scope=/'],
        correctIndex: 0
    },
    {
        text: 'Který bezpečnostní atribut cookie chrání před CSRF útoky u moderních prohlížečů?',
        options: ['SameSite=Lax', 'SecureOnly', 'CrossSite=Block', 'AntiCSRF=true'],
        correctIndex: 0
    },
    {
        text: 'Jaká metoda v JavaScriptu zaokrouhlí číslo klasicky matematicky?',
        options: ['Math.round()', 'Math.floor()', 'Math.ceil()', 'Math.random()'],
        correctIndex: 0
    },
    {
        text: 'Která funkce slouží k opakovanému spouštění kódu v časovém intervalu?',
        options: ['setInterval()', 'setTimeout()', 'requestAnimationFrame()', 'delay()'],
        correctIndex: 0
    },
    {
        text: 'Jakým příkazem zastavíme běžící časovač vytvořený přes setInterval?',
        options: ['clearInterval(timerId)', 'stopTimer()', 'timer.cancel()', 'clearTimeout()'],
        correctIndex: 0
    },
    {
        text: 'Které klíčové slovo v CSS definuje vlastní animaci klíčových snímků?',
        options: ['@keyframes', '@animation', '@transitions', '@keyframes-rule'],
        correctIndex: 0
    },
    {
        text: 'Jak v CSS správně odkážeme na definovanou CSS proměnnou?',
        options: ['var(--primary-color)', '$primary-color', 'val(--primary-color)', 'prop(primary-color)'],
        correctIndex: 0
    }
];

// ------------------------------------------------------------------------------
// 4. OOP Třída Question
// ------------------------------------------------------------------------------

/**
 * Třída reprezentující jednu kvízovou otázku.
 * Zapouzdřuje data a chování pro zobrazení a validaci odpovědí.
 */
class Question {
    /**
     * @param {string} text - Text otázky.
     * @param {string[]} options - Pole možností odpovědí.
     * @param {number} correctIndex - Index správné odpovědi.
     */
    constructor(text, options, correctIndex) {
        this.text = text;
        this.options = options;
        this.correctIndex = correctIndex;
    }

    /**
     * Vytvoří novou instanci otázky s náhodně promíchaným pořadím odpovědí
     * a automaticky přepočítaným indexem správné odpovědi.
     * @param {object} rawQuestion - Surový objekt ze zásobníku.
     * @returns {Question} Nová instance se zamíchanými možnostmi.
     */
    static createShuffled(rawQuestion) {
        const originalCorrectText = rawQuestion.options[rawQuestion.correctIndex];
        const shuffledOptions = shuffle(rawQuestion.options);
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);
        return new Question(rawQuestion.text, shuffledOptions, newCorrectIndex);
    }

    /**
     * Vykreslí otázku a možnosti do HTML struktury.
     * @param {number} currentRound - Číslo aktuální otázky.
     * @param {number} totalQuestions - Celkový počet otázek v kvízu.
     */
    displayQuestion(currentRound, totalQuestions) {
        const badgeEl = document.querySelector('#question-badge');
        const textEl = document.querySelector('#question-text');
        const roundIndicatorEl = document.querySelector('#round-indicator');

        if (badgeEl) badgeEl.textContent = `Otázka ${currentRound}`;
        if (roundIndicatorEl) roundIndicatorEl.textContent = `${currentRound} / ${totalQuestions}`;
        if (textEl) textEl.textContent = this.text;

        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button, index) => {
            const optionTextEl = button.querySelector('.option-text');
            if (optionTextEl && this.options[index] !== undefined) {
                optionTextEl.textContent = this.options[index];
            }
            button.classList.remove('correct', 'wrong', 'disabled');
        });

        const gridEl = document.querySelector('#answers-grid');
        if (gridEl) gridEl.classList.remove('disabled');
    }

    /**
     * Zkontroluje, zda zvolený index odpovídá správné odpovědi.
     * @param {number} selectedIndex - Index zvolené odpovědi (0-3).
     * @returns {boolean} True, pokud je volba správná.
     */
    isCorrect(selectedIndex) {
        return selectedIndex === this.correctIndex;
    }
}

// ------------------------------------------------------------------------------
// 5. Globální konfigurace a Herní stav (State Management)
// ------------------------------------------------------------------------------
const QUESTIONS_PER_GAME = 5;
const TIME_LIMIT_SECONDS = 10;
const TRANSITION_DELAY_MS = 1500;
const COOKIE_HIGHSCORE_KEY = 'quiz_highscore';
const COOKIE_EXPIRATION_DAYS = 30;

const state = {
    currentRound: 0,
    totalQuestions: QUESTIONS_PER_GAME,
    correctAnswers: 0,
    answeredCount: 0,
    timeLeft: TIME_LIMIT_SECONDS,
    timerId: null,
    currentQuestion: null,
    isProcessingAnswer: false,
    questionsQueue: [],
    highScore: 0,
    isNewRecord: false
};

// ------------------------------------------------------------------------------
// 6. Správa High Score (Persistence)
// ------------------------------------------------------------------------------

/**
 * Načte uložené nejvyšší skóre z cookies.
 * @returns {number} Načtené skóre nebo 0, pokud žádné uloženo není.
 */
function loadHighScore() {
    const savedHighScore = getCookie(COOKIE_HIGHSCORE_KEY);
    if (savedHighScore !== null) {
        const parsed = parseInt(savedHighScore, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

/**
 * Uloží nové nejvyšší skóre do cookies, pokud je vyšší než stávající.
 * @param {number} newScore - Nově dosažené skóre.
 * @returns {boolean} True, pokud byl rekord překonán a uložen.
 */
function saveHighScore(newScore) {
    if (newScore > state.highScore) {
        state.highScore = newScore;
        setCookie(COOKIE_HIGHSCORE_KEY, newScore, COOKIE_EXPIRATION_DAYS);
        return true;
    }
    return false;
}

// ------------------------------------------------------------------------------
// 7. Architektura přepínání obrazovek (Screen Manager / User Flow)
// ------------------------------------------------------------------------------

/**
 * Zobrazí požadovanou obrazovku podle ID a skryje všechny ostatní.
 * @param {string} screenId - ID elementu obrazovky.
 */
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
    }
}

// ------------------------------------------------------------------------------
// 8. Řízení životního cyklu hry (Game Lifecycle)
// ------------------------------------------------------------------------------

/**
 * Inicializuje výchozí stav aplikace při startu a načte High Score z cookies.
 */
function initGame() {
    stopTimer();

    // 1. Načtení trvalého rekordu z cookies
    state.highScore = loadHighScore();

    // 2. Aktualizace UI ukazatelů rekordu na úvodní i herní obrazovce
    const startHighScoreEl = document.querySelector('#start-highscore-value');
    const statHighScoreEl = document.querySelector('#highscore-stat');

    if (startHighScoreEl) startHighScoreEl.textContent = state.highScore;
    if (statHighScoreEl) statHighScoreEl.textContent = state.highScore;

    // 3. Zobrazení úvodní obrazovky
    showScreen('start-screen');
}

/**
 * Spustí novou herní relaci kvízu.
 */
function startGame() {
    stopTimer();

    // 1. Reset herního stavu
    state.currentRound = 0;
    state.correctAnswers = 0;
    state.answeredCount = 0;
    state.isProcessingAnswer = false;
    state.isNewRecord = false;

    // 2. Příprava náhodné fronty otázek pro tuto hru
    state.questionsQueue = shuffle(QUESTIONS_POOL).slice(0, QUESTIONS_PER_GAME);
    state.totalQuestions = state.questionsQueue.length;

    // 3. Přepnutí na kvízovou obrazovku
    showScreen('quiz-screen');
    updateStatsUI();

    // 4. Načtení první otázky
    loadNextQuestion();
}

/**
 * Ukončí kvíz, vyhodnotí High Score a zobrazí výsledkovou obrazovku.
 */
function endGame() {
    stopTimer();

    // 1. Výpočet výsledků
    const accuracy = calculateAccuracy(state.correctAnswers, state.totalQuestions);
    const earnedPoints = state.correctAnswers;

    // 2. Vyhodnocení osobního rekordu (Persistence)
    const isRecordBroken = earnedPoints > state.highScore;
    if (isRecordBroken) {
        saveHighScore(earnedPoints);
        state.isNewRecord = true;
    } else {
        state.isNewRecord = false;
    }

    // 3. Aktualizace výsledkových DOM elementů
    const finalScoreEl = document.querySelector('#final-score');
    const finalAccuracyEl = document.querySelector('#final-accuracy');
    const finalPointsEl = document.querySelector('#final-points');
    const finalHighScoreEl = document.querySelector('#final-highscore');
    const finalMessageEl = document.querySelector('#final-message');
    const finalIconEl = document.querySelector('#final-icon');
    const newRecordBannerEl = document.querySelector('#new-record-banner');

    if (finalScoreEl) finalScoreEl.textContent = `${state.correctAnswers} / ${state.totalQuestions}`;
    if (finalAccuracyEl) finalAccuracyEl.textContent = `${accuracy}%`;
    if (finalPointsEl) finalPointsEl.textContent = `${earnedPoints}`;
    if (finalHighScoreEl) finalHighScoreEl.textContent = `${state.highScore}`;

    // 4. Oslavný banner při novém rekordu
    if (newRecordBannerEl) {
        if (state.isNewRecord) {
            newRecordBannerEl.classList.remove('hidden');
        } else {
            newRecordBannerEl.classList.add('hidden');
        }
    }

    // 5. Vizuální hodnocení na základě úspěšnosti
    if (finalMessageEl && finalIconEl) {
        if (state.isNewRecord) {
            finalIconEl.textContent = '👑';
            finalMessageEl.textContent = 'Fantastický výkon! Dosáhl jsi nového osobního rekordu!';
        } else if (accuracy >= 80) {
            finalIconEl.textContent = '🏆';
            finalMessageEl.textContent = 'Vynikající práce! Jsi opravdový mistr moderního webu.';
        } else if (accuracy >= 50) {
            finalIconEl.textContent = '👍';
            finalMessageEl.textContent = 'Dobrá práce! Máš solidní základy, zkus to dotáhnout na rekord.';
        } else {
            finalIconEl.textContent = '💡';
            finalMessageEl.textContent = 'Nevadí, cvičení dělá mistra! Zkus kvíz znovu a překonej své skóre.';
        }
    }

    // 6. Aktualizace úvodního High Score pro případný návrat
    const startHighScoreEl = document.querySelector('#start-highscore-value');
    if (startHighScoreEl) startHighScoreEl.textContent = state.highScore;

    // 7. Přepnutí na výsledkovou obrazovku
    showScreen('end-screen');
}

// ------------------------------------------------------------------------------
// 9. Řízení časovače a Statistik (Asynchronní JS)
// ------------------------------------------------------------------------------

/**
 * Aktualizuje panel statistik v DOMu.
 */
function updateStatsUI() {
    const scoreEl = document.querySelector('#score');
    const accuracyEl = document.querySelector('#accuracy');
    const roundIndicatorEl = document.querySelector('#round-indicator');
    const statHighScoreEl = document.querySelector('#highscore-stat');

    if (scoreEl) scoreEl.textContent = `${state.correctAnswers}`;
    if (roundIndicatorEl) roundIndicatorEl.textContent = `${state.currentRound || 1} / ${state.totalQuestions}`;
    if (statHighScoreEl) statHighScoreEl.textContent = `${state.highScore}`;

    if (accuracyEl) {
        const accuracy = calculateAccuracy(state.correctAnswers, state.answeredCount);
        accuracyEl.textContent = `${accuracy}%`;
    }
}

/**
 * Aktualizuje vizuální zobrazení zbývajícího času.
 */
function updateTimerUI() {
    const timerSecondsEl = document.querySelector('#timer-seconds');
    const timerDisplayEl = document.querySelector('#timer-display');
    const progressBarEl = document.querySelector('#timer-progress-bar');

    if (timerSecondsEl) timerSecondsEl.textContent = state.timeLeft;

    if (progressBarEl) {
        const percentage = (state.timeLeft / TIME_LIMIT_SECONDS) * 100;
        progressBarEl.style.width = `${percentage}%`;
    }

    if (timerDisplayEl && progressBarEl) {
        if (state.timeLeft <= 3) {
            timerDisplayEl.classList.add('danger');
            timerDisplayEl.classList.remove('warning');
            progressBarEl.classList.add('danger');
            progressBarEl.classList.remove('warning');
        } else if (state.timeLeft <= 5) {
            timerDisplayEl.classList.add('warning');
            timerDisplayEl.classList.remove('danger');
            progressBarEl.classList.add('warning');
            progressBarEl.classList.remove('danger');
        } else {
            timerDisplayEl.classList.remove('warning', 'danger');
            progressBarEl.classList.remove('warning', 'danger');
        }
    }
}

/**
 * Spustí odpočítávací časovač pro aktuální otázku.
 */
function startTimer() {
    stopTimer();
    state.timeLeft = TIME_LIMIT_SECONDS;
    updateTimerUI();

    state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerUI();

        if (state.timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

/**
 * Zastaví běžící odpočet.
 */
function stopTimer() {
    if (state.timerId !== null) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

// ------------------------------------------------------------------------------
// 10. Herní logika otázek a obsluha odpovědí
// ------------------------------------------------------------------------------

/**
 * Načte další otázku z fronty nebo ukončí hru.
 */
function loadNextQuestion() {
    if (state.currentRound >= state.totalQuestions) {
        endGame();
        return;
    }

    state.isProcessingAnswer = false;
    state.currentRound++;

    const rawQuestion = state.questionsQueue[state.currentRound - 1];
    state.currentQuestion = Question.createShuffled(rawQuestion);

    state.currentQuestion.displayQuestion(state.currentRound, state.totalQuestions);
    updateStatsUI();

    startTimer();
}

/**
 * Vyhodnotí odpověď uživatele po kliknutí na tlačítko možnosti.
 * @param {number} selectedIndex - Index kliknutého tlačítka.
 * @param {HTMLButtonElement} buttonEl - Element kliknutého tlačítka.
 */
function handleAnswerSelection(selectedIndex, buttonEl) {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;
    stopTimer();

    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    const isCorrect = state.currentQuestion.isCorrect(selectedIndex);
    state.answeredCount++;

    if (isCorrect) {
        state.correctAnswers++;
        buttonEl.classList.add('correct');
    } else {
        buttonEl.classList.add('wrong');
        const answerButtons = document.querySelectorAll('.answer-btn');
        const correctBtn = answerButtons[state.currentQuestion.correctIndex];
        if (correctBtn) correctBtn.classList.add('correct');
    }

    updateStatsUI();

    setTimeout(() => {
        loadNextQuestion();
    }, TRANSITION_DELAY_MS);
}

/**
 * Obsluha vypršení časového limitu bez reakce uživatele.
 */
function handleTimeout() {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;

    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    state.answeredCount++;

    const answerButtons = document.querySelectorAll('.answer-btn');
    const correctBtn = answerButtons[state.currentQuestion.correctIndex];
    if (correctBtn) correctBtn.classList.add('correct');

    updateStatsUI();

    setTimeout(() => {
        loadNextQuestion();
    }, TRANSITION_DELAY_MS);
}

// ------------------------------------------------------------------------------
// 11. Inicializace aplikace a Registrace událostí (DOM Ready)
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tlačítko pro spuštění kvízu z úvodní obrazovky
    const startBtn = document.querySelector('#start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startGame();
        });
    }

    // 2. Tlačítko pro restartování kvízu ze závěrečné obrazovky
    const restartBtn = document.querySelector('#restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startGame();
        });
    }

    // 3. Registrace posluchačů událostí na tlačítka odpovědí
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const clickedIndex = parseInt(button.dataset.index, 10);
            handleAnswerSelection(clickedIndex, button);
        });
    });

    // 4. Nastavení výchozího stavu a načtení High Score
    initGame();
});
