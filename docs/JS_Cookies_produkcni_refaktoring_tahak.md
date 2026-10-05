
# 🚀 Tahák: Ukládání dat (Cookies) & Produkční refaktoring

---

## 1. JavaScript – Práce s Cookies

Cookies jsou malé textové řetězce ukládané v prohlížeči uživatele. Přistupuje se k nim přes vlastnost `document.cookie`.

### 📝 Zápis do Cookie
Zápis se provádí přiřazením řetězce ve formátu `klíč=hodnota` s volitelnými atributy oddělenými středníkem.

```javascript
// Základní zápis (zanikne po zavření prohlížeče / session)
document.cookie = "username=Jan";

// Zápis s nastavením životnosti (max-age v sekundách) a cestou (path)
// max-age=3600 (1 hodina), max-age=86400 (1 den), max-age=604800 (1 týden)
document.cookie = "highScore=1250; max-age=604800; path=/";

```

> **Poznámka:** Přiřazení do `document.cookie` nepřepíše všechny existující cookies, pouze přidá nebo aktualizuje konkrétní klíč.

---

### 🔍 Čtení a parsování Cookies

Vlastnost `document.cookie` vrací jediný řetězec obsahující všechny přístupné cookies oddělené středníkem a mezerou (např. `"theme=dark; highScore=1250"`).

#### Pomocná funkce pro vyhledání hodnoty podle klíče:

```javascript
function getCookie(name) {
  // 1. Načtení celého řetězce cookies
  const allCookies = document.cookie;
  if (!allCookies) return null;

  // 2. Rozdělení řetězce podle středníku na jednotlivé dvojice
  const cookieArray = allCookies.split(';');

  // 3. Procházení a vyhledání požadovaného klíče
  for (let cookie of cookieArray) {
    // Odstranění úvodních a koncových mezer
    cookie = cookie.trim();

    // Kontrola, zda cookie začíná hledaným názvem
    if (cookie.startsWith(name + '=')) {
      // Rozdělení podle '=' a vrácení samotné hodnoty
      return cookie.split('=')[1];
    }
  }

  return null;
}

// Použití:
const userScore = getCookie('highScore');
console.log(userScore); // "1250" nebo null

```

---

### 💾 Praktický příklad: Trvalost High Score

Uložení a opětovné načtení nejvyššího skóre při načtení stránky nebo hry.

```javascript
let highScore = 0;

// 1. Načtení uloženého skóre při startu
function initGame() {
  const savedScore = getCookie("highScore");
  
  if (savedScore !== null) {
    highScore = parseInt(savedScore, 10);
  } else {
    highScore = 0;
  }
  
  updateHighScoreUI(highScore);
}

// 2. Aktualizace a uložení nového skóre
function saveHighScore(newScore) {
  if (newScore > highScore) {
    highScore = newScore;
    
    // Uložení na 30 dní (30 * 24 * 60 * 60 = 2 592 000 s)
    document.cookie = `highScore=${highScore}; max-age=2592000; path=/`;
    updateHighScoreUI(highScore);
  }
}

```

---

## 2. CSS3 & JS – Produkční úpravy

Před nasazením projektu do produkce je potřeba kód vyčistit, zorganizovat a zkontrolovat zobrazení.

### 🧹 Refaktoring JavaScriptu

* **Odstranění ladicích výpisů:** Vymaž nebo zakomentuj všechny nepotřebné `console.log()`, `console.dir()` a `debugger`.
* **Modularizace funkcí:**
* Jedna funkce = jedna odpovědnost (Single Responsibility Principle).
* Rozděl dlouhé bloky kódu na menší, opakovaně použitelné pomocné funkce.


* **Konvence pojmenování:**
* **Proměnné a funkce:** `camelCase` (např. `calculateScore`, `isGameActive`).
* **Konstanty:** `UPPER_SNAKE_CASE` (např. `MAX_PLAYERS`, `DEFAULT_TIMEOUT`).
* **Třídy / Konstruktory:** `PascalCase` (např. `PlayerProfile`).
* Zvol jasná a výstižná jména (vyhni se zkratkám typu `a`, `temp1`, `data2`).



---

### 🎨 Finální styling & CSS

* **Aplikace témat (CSS Proměnné):**
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-color: #0066cc;
}

[data-theme="dark"] {
  --bg-primary: #121212;
  --text-primary: #f0f0f0;
  --accent-color: #4da6ff;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

```


* **Responsivita & Media Queries:**
* Používej **Mobile-First** přístup (`min-width`).
* Testuj na klíčových breakpointech:
* Mobil: `< 768px`
* Tablet: `768px – 1024px`
* Desktop: `> 1024px`




* **Kontrola zobrazení:**
* Ověř chování na dotykových zařízeních (velikost tlačítkových ploch, `hover` efekty na mobilu).
* Zkontroluj přetékání textu (`overflow`, `word-break`) a správné škálování obrázků (`max-width: 100%`).