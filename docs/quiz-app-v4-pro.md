# QuizApp v4: Trvalá Data, Persistence a Finální Produkt

## 1. Cíl aplikace a fáze vývoje
Tato verze představuje **4. finální fázi (produkční vydání s trvalým ukládáním dat)**.

Cílem je doplnit aplikaci o trvalou paměť pomocí **cookies**, která umožňuje ukládat nejvyšší dosažené skóre (High Score) a historii výsledků přímo v prohlížeči uživatele. Aplikace dále projde finálním refaktoringem kódu, kompletním přenesením grafických detailů z Figmy a bude připravena k prezentaci jako komerčně hodnotný webový produkt.

---

## 2. Pohled uživatele (User Experience)
1. **Opakovaná návštěva (Persistence):** Když uživatel otevře aplikaci (i po zavření prohlížeče), na úvodní obrazovce okamžitě vidí své osobní nejvyšší dosažené skóre (High Score) načtené z paměti cookies.
2. **Průchod kvízem:** Uživatel hraje kvíz v kompletním vyladěném vizuálním tématu s plynulými přechody a animacemi.
3. **Překonání rekordu:** Pokud v závěru hry dosáhne nového nejlepšího výsledku, aplikace ho na to upozorní speciální oslavnou animací/zprávou a nový rekord ihned uloží do cookies.
4. **Prezentace a sdílení:** Aplikace je plně responzivní, bezchybná a připravená na předvedení klientovi či spolužákům.

---

## 3. Architektura a souborová struktura

```text
quiz-app-v4-pro/
├── index.html            # Produkční HTML5 se všemi obrazovkami a High Score
├── style.css             # Finální produkční CSS (responzivní, vyladěné detaily)
├── styles-students.css   # Pracovní verze CSS s instrukcemi pro finální úpravy
├── script.js             # Produkční JS (Cookies API, High Score, čistý kód)
├── script-students.js    # Pracovní verze JS s nápovědou pro praci s cookies
└── README.md             # Kompletní dokumentace, architektura a UML diagram
```

---

## 4. Detailní specifikace komponent a technologií

### A. JavaScript ES6+ (Práce s Cookies a Persistence)
* **Zápis do cookie (Cookie Writer):**
  * Vytvoření pomocné funkce `setCookie(name, value, days)`:
    ```javascript
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
    ```
* **Čtení a parsování cookie (Cookie Reader):**
  * Vytvoření pomocné funkce `getCookie(name)`:
    * Načtení řetězce `document.cookie`.
    * Rozdělení řetězce podle středníků `;` a vyhledání příslušného klíče.
    * Vrácení uložené hodnoty nebo `null`, pokud klíč neexistuje.
* **Logika High Score:**
  * Při načtení stránky se vyvolá `getCookie('quiz_highscore')`.
  * Pokud hodnota existuje, zobrazí se na úvodní i závěrečné obrazovce.
  * Na konci hry (`endGame`) se porovná aktuální skóre s uloženým rekordem. Pokud je aktuální skóre vyšší, zavolá se `setCookie('quiz_highscore', currentScore, 30)` a aktualizuje se UI.

### B. CSS3 & Design (Produkční poladění)
* **Převedení kompletního designu z Figmy:**
  * Přesné vyladění zaoblení rohů, stínů (`box-shadow`), mikrainterakcí a responzivity pro mobilní zařízení (`@media` dotazy).
* **Vizuální oslava rekordu:**
  * Speciální CSS třída `.new-record` vyvolávající zvýraznění nebo konfetový efekt při překonání osobního rekordu.

### C. Refaktoring a kvalita kódu (Code Quality)
* Odstranění všech cvičných `console.log()` výpisů.
* Důsledné dodržování konvencí pojmenování proměnných a funkcí (camelCase).
* Ošetření hraničních stavů (první spuštění bez existujících cookies, resetování rekordu).

---

## 5. Akceptační kritéria pro vývojáře
- [ ] Aplikace obsahuje funkční pomocné metody pro čtení a zápis cookies (`setCookie`, `getCookie`).
- [ ] Nejvyšší dosažené skóre se trvale ukládá do prohlížeče a zůstává zachováno i po obnovení stránky (F5).
- [ ] Úvodní i výsledková obrazovka správně zobrazuje aktuální rekord uživatele.
- [ ] Při překonání rekordu aplikace uživatele vizuálně upozorní a rekord aktualizuje.
- [ ] Kód je čistý, bez zbytečných výpisů do konzole a splňuje všechny estetické požadavky z Figmy.
- [ ] Aplikace je plně responzivní a připravená na finální prezentaci.
