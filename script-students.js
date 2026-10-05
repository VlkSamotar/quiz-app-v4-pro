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
 * QuizApp v4 Pro - Pracovní JavaScript pro studenty (Studentská verze)
 * Úkoly: Zápis a čtení Cookies (setCookie, getCookie), trvalá správa High Score,
 * detekce překonání osobního rekordu a produkční vyhodnocení
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. Pomocné matematické funkce (Ponecháno plně funkční)
// ------------------------------------------------------------------------------

/**
 * Generuje náhodné celé číslo v intervalu [min, max] včetně obou mezí.
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Náhodně promíchá kopii pole pomocí Fisher-Yates shuffle algoritmu.
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
 */
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

// ------------------------------------------------------------------------------
// 2. JavaScript Cookies API (Studentské úkoly TODO 1 a TODO 2)
// ------------------------------------------------------------------------------

/**
 * Uloží hodnotu do cookie prohlížeče s nastavenou dobou platnosti ve dnech.
 * @param {string} name - Název klíče cookie.
 * @param {string|number} value - Ukládaná hodnota.
 * @param {number} [days=30] - Počet dní platnosti.
 */
function setCookie(name, value, days = 30) {
    // TODO 1: Vytvoř a ulož cookie do document.cookie s nastaveným datem vypršení (expires) a cestou (path=/).
    // 1. Vytvoř nový objekt data: const date = new Date();
    // 2. Nastav čas na budoucí datum: date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    // 3. Převeď na UTC řetězec: const expires = "expires=" + date.toUTCString();
    // 4. Zapiš do document.cookie ve formátu "name=value; expires=...; path=/; SameSite=Lax"
    //
    // NÁPOVĚDA:
    // const date = new Date();
    // date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    // const expires = "expires=" + date.toUTCString();
    // document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 1:
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

/**
 * Načte hodnotu cookie podle jejího klíče.
 * @param {string} name - Název hledané cookie.
 * @returns {string|null} Uložená hodnota nebo null.
 */
function getCookie(name) {
    // TODO 2: Přečti řetězec document.cookie a vyhledej hodnotu pro zadaný klíč.
    // 1. Načti document.cookie. Pokud je prázdný, vrať null.
    // 2. Rozděl řetězec podle středníku ';' na jednotlivé cookies.
    // 3. Projdi cookies cyklem for...of, odstraň bílé znaky (.trim()) a zkontroluj, zda začíná hledaným "name=".
    // 4. Pokud ano, vrať část za znakem '=' (použij decodeURIComponent pro dekódování).
    // 5. Pokud klíč nenajdeš, vrať null.
    //
    // NÁPOVĚDA:
    // const allCookies = document.cookie;
    // if (!allCookies) return null;
    // const cookieArray = allCookies.split(';');
    // const encodedName = encodeURIComponent(name) + '=';
    // for (let cookie of cookieArray) {
    //     cookie = cookie.trim();
    //     if (cookie.startsWith(encodedName)) {
    //         return decodeURIComponent(cookie.substring(encodedName.length));
    //     }
    // }
    // return null;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 2:
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
// 3. Zásobník otázek (Ponecháno funkční)
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
// 4. OOP Třída Question (Ponechána funkční)
// ------------------------------------------------------------------------------
class Question {
    constructor(text, options, correctIndex) {
        this.text = text;
        this.options = options;
        this.correctIndex = correctIndex;
    }

    static createShuffled(rawQuestion) {
        const originalCorrectText = rawQuestion.options[rawQuestion.correctIndex];
        const shuffledOptions = shuffle(rawQuestion.options);
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);
        return new Question(rawQuestion.text, shuffledOptions, newCorrectIndex);
    }

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

    isCorrect(selectedIndex) {
        return selectedIndex === this.correctIndex;
    }
}

// ------------------------------------------------------------------------------
// 5. Globální konfigurace a Herní stav
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
// 6. Správa High Score (Studentské úkoly TODO 3 a TODO 4)
// ------------------------------------------------------------------------------

/**
 * Načte uložené nejvyšší skóre z cookies.
 * @returns {number}
 */
function loadHighScore() {
    // TODO 3: Načti uložené skóre pomocí getCookie(COOKIE_HIGHSCORE_KEY).
    // Pokud hodnota existuje, převeď ji na celé číslo pomocí parseInt(..., 10) a vrať.
    // Pokud hodnota neexistuje nebo není číslo, vrať 0.
    //
    // NÁPOVĚDA:
    // const savedHighScore = getCookie(COOKIE_HIGHSCORE_KEY);
    // if (savedHighScore !== null) {
    //     const parsed = parseInt(savedHighScore, 10);
    //     return isNaN(parsed) ? 0 : parsed;
    // }
    // return 0;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 3:
    const savedHighScore = getCookie(COOKIE_HIGHSCORE_KEY);
    if (savedHighScore !== null) {
        const parsed = parseInt(savedHighScore, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

/**
 * Uloží nové nejvyšší skóre do cookies, pokud překonalo dosavadní maximum.
 * @param {number} newScore
 * @returns {boolean}
 */
function saveHighScore(newScore) {
    // TODO 4: Porovnej newScore s aktuálním state.highScore.
    // Pokud je newScore > state.highScore:
    // 1. Aktualizuj state.highScore = newScore;
    // 2. Ulož do cookies pomocí setCookie(COOKIE_HIGHSCORE_KEY, newScore, COOKIE_EXPIRATION_DAYS);
    // 3. Vrať true. Jinak vrať false.
    //
    // NÁPOVĚDA:
    // if (newScore > state.highScore) {
    //     state.highScore = newScore;
    //     setCookie(COOKIE_HIGHSCORE_KEY, newScore, COOKIE_EXPIRATION_DAYS);
    //     return true;
    // }
    // return false;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 4:
    if (newScore > state.highScore) {
        state.highScore = newScore;
        setCookie(COOKIE_HIGHSCORE_KEY, newScore, COOKIE_EXPIRATION_DAYS);
        return true;
    }
    return false;
}

// ------------------------------------------------------------------------------
// 7. Architektura přepínání obrazovek (Ponecháno funkční)
// ------------------------------------------------------------------------------
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
// 8. Řízení životního cyklu hry (Studentské úkoly TODO 5 a TODO 6)
// ------------------------------------------------------------------------------

/**
 * Inicializuje výchozí stav aplikace při startu a načte High Score z cookies.
 */
function initGame() {
    stopTimer();

    // TODO 5: Načti rekord z cookies a aktualizuj DOM prvky.
    // 1. state.highScore = loadHighScore();
    // 2. Nastav textContent prvků '#start-highscore-value' a '#highscore-stat' na state.highScore.
    // 3. Přepni na úvodní obrazovku pomocí showScreen('start-screen').
    //
    // NÁPOVĚDA:
    // state.highScore = loadHighScore();
    // const startHighScoreEl = document.querySelector('#start-highscore-value');
    // const statHighScoreEl = document.querySelector('#highscore-stat');
    // if (startHighScoreEl) startHighScoreEl.textContent = state.highScore;
    // if (statHighScoreEl) statHighScoreEl.textContent = state.highScore;
    // showScreen('start-screen');

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 5:
    state.highScore = loadHighScore();
    const startHighScoreEl = document.querySelector('#start-highscore-value');
    const statHighScoreEl = document.querySelector('#highscore-stat');

    if (startHighScoreEl) startHighScoreEl.textContent = state.highScore;
    if (statHighScoreEl) statHighScoreEl.textContent = state.highScore;

    showScreen('start-screen');
}

/**
 * Spustí novou herní relaci kvízu. (Ponecháno funkční)
 */
function startGame() {
    stopTimer();

    state.currentRound = 0;
    state.correctAnswers = 0;
    state.answeredCount = 0;
    state.isProcessingAnswer = false;
    state.isNewRecord = false;

    state.questionsQueue = shuffle(QUESTIONS_POOL).slice(0, QUESTIONS_PER_GAME);
    state.totalQuestions = state.questionsQueue.length;

    showScreen('quiz-screen');
    updateStatsUI();
    loadNextQuestion();
}

/**
 * Ukončí kvíz, vyhodnotí High Score a zobrazí výsledkovou obrazovku.
 */
function endGame() {
    stopTimer();

    const accuracy = calculateAccuracy(state.correctAnswers, state.totalQuestions);
    const earnedPoints = state.correctAnswers;

    // TODO 6: Vyhodnoť překonání osobního rekordu a zobraz výsledky.
    // 1. Zkontroluj, zda earnedPoints > state.highScore. Pokud ano, zavolej saveHighScore(earnedPoints) a nastav state.isNewRecord = true.
    // 2. Vlož hodnoty do textContent prvků '#final-score', '#final-accuracy', '#final-points' a '#final-highscore'.
    // 3. Pokud je state.isNewRecord === true, odeber třídu 'hidden' banneru '#new-record-banner', jinak ji přidej.
    // 4. Přepni na obrazovku showScreen('end-screen').
    //
    // NÁPOVĚDA:
    // const isRecordBroken = earnedPoints > state.highScore;
    // if (isRecordBroken) {
    //     saveHighScore(earnedPoints);
    //     state.isNewRecord = true;
    // } else {
    //     state.isNewRecord = false;
    // }
    // const newRecordBannerEl = document.querySelector('#new-record-banner');
    // if (newRecordBannerEl) {
    //     if (state.isNewRecord) newRecordBannerEl.classList.remove('hidden');
    //     else newRecordBannerEl.classList.add('hidden');
    // }

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 6:
    const isRecordBroken = earnedPoints > state.highScore;
    if (isRecordBroken) {
        saveHighScore(earnedPoints);
        state.isNewRecord = true;
    } else {
        state.isNewRecord = false;
    }

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

    if (newRecordBannerEl) {
        if (state.isNewRecord) {
            newRecordBannerEl.classList.remove('hidden');
        } else {
            newRecordBannerEl.classList.add('hidden');
        }
    }

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

    const startHighScoreEl = document.querySelector('#start-highscore-value');
    if (startHighScoreEl) startHighScoreEl.textContent = state.highScore;

    showScreen('end-screen');
}

// ------------------------------------------------------------------------------
// 9. Řízení časovače a Statistik (Ponecháno funkční)
// ------------------------------------------------------------------------------
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

function stopTimer() {
    if (state.timerId !== null) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

// ------------------------------------------------------------------------------
// 10. Herní logika otázek a obsluha odpovědí (Ponecháno funkční)
// ------------------------------------------------------------------------------
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
    const startBtn = document.querySelector('#start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startGame();
        });
    }

    const restartBtn = document.querySelector('#restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startGame();
        });
    }

    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const clickedIndex = parseInt(button.dataset.index, 10);
            handleAnswerSelection(clickedIndex, button);
        });
    });

    initGame();
});
