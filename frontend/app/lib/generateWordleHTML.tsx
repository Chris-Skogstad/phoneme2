import { WordleWord } from "./wordleWords";
import { getPhonemeKeyboard } from "./phonemeKeyboard";
import { phonemeLegend } from "./phonemeLegend";
import { Locale } from "./locales";

type WordleWordWithHint = WordleWord & { hint?: string | null };

export function generateWordleHTML(
  word: WordleWordWithHint,
  maxGuesses: number,
  locale: Locale,
  showHints: boolean = false
): string {
  const keyboardTokens = getPhonemeKeyboard(locale);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Phoneme Wordle</title>
<style>
  body { font-family: sans-serif; background: #111827; color: white; display: flex; flex-direction: column; align-items: center; padding: 24px; }
  h1 { margin-bottom: 16px; }
  #hint { font-size: 0.9rem; color: #9ca3af; font-style: italic; margin-bottom: 12px; min-height: 1.2em; }
  #board { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; }
  .row { display: flex; gap: 4px; }
  .tile { position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: #1f2937; border: 2px solid #374151; border-radius: 4px; font-weight: bold; font-size: 1rem; }
  .tile.correct { background: #16a34a; border-color: #16a34a; }
  .tile.wrong-position { background: #d97706; border-color: #d97706; }
  .tile.absent { background: #4b5563; border-color: #4b5563; }
  .tile-hint { display: none; position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: black; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; white-space: nowrap; z-index: 10; }
  .tile:hover .tile-hint { display: block; }
  #keyboard { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; max-width: 480px; margin-bottom: 16px; }
  .key { position: relative; padding: 12px 16px; font-size: 1.1rem; background: #374151; border: none; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; }
  .key:hover { background: #4b5563; }
  .key .key-hint { display: none; position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: black; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; white-space: nowrap; z-index: 10; }
  .key:hover .key-hint { display: block; }
  .key.correct { background: #16a34a; }
  .key.wrong-position { background: #d97706; }
  .key.absent { background: #4b5563; opacity: 0.5; }
  #controls { display: flex; gap: 12px; margin-bottom: 16px; }
  button.action { padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
  #backspace { background: #4b5563; color: white; }
  #submit { background: #4f46e5; color: white; }
  #message { font-size: 1.2rem; font-weight: bold; min-height: 1.5em; text-align: center; }
  #message.won { color: #4ade80; }
  #message.lost { color: #f87171; }
</style>
</head>
<body>
<h1>Phoneme Wordle</h1>
${showHints && word.hint ? `<div id="hint">Hint: ${word.hint}</div>` : ""}
<div id="board"></div>
<div id="message"></div>
<div id="keyboard"></div>
<div id="controls">
  <button id="backspace" class="action">Backspace</button>
  <button id="submit" class="action">Enter</button>
</div>

<script>
  const target = ${JSON.stringify(word.phonemes)};
  const targetEnglish = ${JSON.stringify(word.english)};
  const maxGuesses = ${maxGuesses};
  const keyboardTokens = ${JSON.stringify(keyboardTokens)};
  const phonemeLegend = ${JSON.stringify(phonemeLegend)};

  let guesses = [];
  let currentGuess = [];
  let status = "playing";

  const boardEl = document.getElementById("board");
  const messageEl = document.getElementById("message");
  const keyboardEl = document.getElementById("keyboard");

  function evaluateGuess(guess, target) {
    const result = guess.map((token) => ({ token, state: "absent" }));
    const remaining = [...target];

    guess.forEach((token, i) => {
      if (token === target[i]) {
        result[i].state = "correct";
        remaining[i] = "__used__";
      }
    });

    guess.forEach((token, i) => {
      if (result[i].state === "correct") return;
      const idx = remaining.indexOf(token);
      if (idx !== -1) {
        result[i].state = "wrong-position";
        remaining[idx] = "__used__";
      }
    });

    return result;
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < maxGuesses; r++) {
      const row = document.createElement("div");
      row.className = "row";

      for (let c = 0; c < target.length; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        let token = "";
        let tileState = "";

        if (r < guesses.length) {
          token = guesses[r][c].token;
          tileState = guesses[r][c].state;
          tile.classList.add(tileState);
        } else if (r === guesses.length && c < currentGuess.length) {
          token = currentGuess[c];
        }

        if (token) {
          const label = document.createElement("span");
          label.textContent = token;
          tile.appendChild(label);

          const hint = document.createElement("span");
          hint.className = "tile-hint";
          hint.textContent = phonemeLegend[token] || token;
          tile.appendChild(hint);
        }

        row.appendChild(tile);
      }

      boardEl.appendChild(row);
    }
  }

  function computeKeyStates() {
    const priority = { absent: 0, "wrong-position": 1, correct: 2 };
    const states = {};
    guesses.forEach((guess) => {
      guess.forEach(({ token, state }) => {
        if (!states[token] || priority[state] > priority[states[token]]) {
          states[token] = state;
        }
      });
    });
    return states;
  }

  function renderKeyboard() {
    const keyStates = computeKeyStates();
    keyboardEl.innerHTML = "";
    keyboardTokens.forEach((token) => {
      const key = document.createElement("button");
      key.className = "key";
      if (keyStates[token]) {
        key.classList.add(keyStates[token]);
      }
      key.textContent = token;

      const hint = document.createElement("span");
      hint.className = "key-hint";
      hint.textContent = phonemeLegend[token] || token;
      key.appendChild(hint);

      key.addEventListener("click", () => {
        if (status !== "playing") return;
        if (currentGuess.length < target.length) {
          currentGuess.push(token);
          renderBoard();
        }
      });

      keyboardEl.appendChild(key);
    });
  }

  document.getElementById("backspace").addEventListener("click", () => {
    if (status !== "playing") return;
    currentGuess.pop();
    renderBoard();
  });

  document.getElementById("submit").addEventListener("click", () => {
    if (status !== "playing") return;
    if (currentGuess.length !== target.length) {
      messageEl.textContent = "Not enough phonemes yet.";
      return;
    }

    const result = evaluateGuess(currentGuess, target);
    guesses.push(result);
    currentGuess = [];

    const isWin = result.every((r) => r.state === "correct");

    if (isWin) {
      status = "won";
      messageEl.textContent = "🎉 Correct! " + target.join(" ") + " → " + targetEnglish;
      messageEl.className = "won";
    } else if (guesses.length >= maxGuesses) {
      status = "lost";
      messageEl.textContent = "Out of guesses. The word was " + target.join(" ") + " → " + targetEnglish;
      messageEl.className = "lost";
    } else {
      messageEl.textContent = "";
    }

    renderBoard();
    renderKeyboard();
  });

  renderBoard();
  renderKeyboard();
</script>
</body>
</html>`;
}