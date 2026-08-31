import { WordSearchGrid } from "./generateGrid";
import { PhonemeWord } from "./wordSearchWords";
import { phonemeLegend } from "./phonemeLegend";

export function generateWordSearchHTML(
  gridData: WordSearchGrid,
  words: PhonemeWord[]
): string {
  const { grid, placements } = gridData;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Phoneme Word Search</title>
<style>
  body { font-family: sans-serif; background: #111827; color: white; display: flex; flex-direction: column; align-items: center; padding: 24px; }
  h1 { margin-bottom: 4px; }
  #grid { display: grid; grid-template-columns: repeat(${grid.length}, minmax(0, 1fr)); gap: 2px; margin: 20px 0; user-select: none; max-width: ${grid.length * 40 + (grid.length - 1) * 2}px; width: 100%; }
  .cell { position: relative; width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; background: #1f2937; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: clamp(0.6rem, 3vw, 0.9rem); }
  .cell.selected { background: #4f46e5; }
  .cell.found { background: #16a34a; }
  .cell-hint { display: none; position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: black; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; white-space: nowrap; z-index: 10; }
  .cell:hover .cell-hint { display: block; }
  #words { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px; }
  .word-item { position: relative; padding: 6px 12px; background: #1f2937; border-radius: 6px; cursor: default; }
  .word-item.found { background: #14532d; }
  .word-item .hint { display: none; position: absolute; left: 50%; transform: translateX(-50%); top: -28px; background: black; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; white-space: nowrap; }
  .word-item:hover .hint { display: block; }
  .word-item .answer { display: none; margin-left: 8px; font-weight: bold; color: #4ade80; }
  .word-item.found .answer { display: inline; }
  .word-item.found .phoneme-text { text-decoration: line-through; opacity: 0.7; }
  #message { margin-top: 16px; font-size: 1.2rem; font-weight: bold; color: #16a34a; min-height: 1.5em; }
</style>
</head>
<body>
<h1>Phoneme Word Search</h1>
<p>Click and drag to select a word. Hover a phoneme cell or word to see its English equivalent.</p>

<div id="words">
  ${words
    .map(
      (w) =>
        `<div class="word-item" data-word="${w.english}"><span class="phoneme-text">${w.phonemes.join(
          " "
        )}</span><div class="hint">${w.english}</div><span class="answer">→ ${w.english}</span></div>`
    )
    .join("")}
</div>

<div id="grid"></div>
<div id="message"></div>

<script>
  const gridData = ${JSON.stringify(grid)};
  const placements = ${JSON.stringify(placements)};
  const phonemeLegend = ${JSON.stringify(phonemeLegend)};

  const gridEl = document.getElementById("grid");
  const messageEl = document.getElementById("message");
  const foundWords = new Set();
  let selecting = false;
  let selectedCells = [];

  function cellKey(r, c) { return r + "-" + c; }

  gridData.forEach((row, r) => {
    row.forEach((token, c) => {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.row = r;
      div.dataset.col = c;

      const label = document.createElement("span");
      label.textContent = token;
      div.appendChild(label);

      const hint = document.createElement("span");
      hint.className = "cell-hint";
      hint.textContent = phonemeLegend[token] || token;
      div.appendChild(hint);

      div.addEventListener("mousedown", () => {
        selecting = true;
        selectedCells = [{ row: r, col: c }];
        updateSelection();
      });
      div.addEventListener("mouseenter", () => {
        if (!selecting) return;
        const last = selectedCells[0];
        const cells = [];
        const dr = Math.sign(r - last.row);
        const dc = Math.sign(c - last.col);
        const steps = Math.max(Math.abs(r - last.row), Math.abs(c - last.col));
        for (let i = 0; i <= steps; i++) {
          cells.push({ row: last.row + dr * i, col: last.col + dc * i });
        }
        selectedCells = cells;
        updateSelection();
      });
      div.addEventListener("mouseup", () => {
        selecting = false;
        checkSelection();
      });

      gridEl.appendChild(div);
    });
  });

  function updateSelection() {
    document.querySelectorAll(".cell").forEach((el) => el.classList.remove("selected"));
    selectedCells.forEach(({ row, col }) => {
      const el = document.querySelector(\`.cell[data-row="\${row}"][data-col="\${col}"]\`);
      if (el) el.classList.add("selected");
    });
  }

  function checkSelection() {
    const selectedKeys = selectedCells.map((c) => cellKey(c.row, c.col)).join(",");
    const reversedKeys = [...selectedCells].reverse().map((c) => cellKey(c.row, c.col)).join(",");

    for (const placement of placements) {
      const placementKeys = placement.cells.map((c) => cellKey(c.row, c.col)).join(",");
      if ((placementKeys === selectedKeys || placementKeys === reversedKeys) && !foundWords.has(placement.word)) {
        foundWords.add(placement.word);
        placement.cells.forEach(({ row, col }) => {
          document.querySelector(\`.cell[data-row="\${row}"][data-col="\${col}"]\`).classList.add("found");
        });
        const item = document.querySelector(\`.word-item[data-word="\${placement.word}"]\`);
        item.classList.add("found");
        messageEl.textContent = "✅ Correct! " + placement.tokens.join(" ") + " → " + placement.word;
      }
    }

    document.querySelectorAll(".cell.selected").forEach((el) => el.classList.remove("selected"));
    selectedCells = [];

    if (foundWords.size === placements.length) {
      messageEl.textContent = "🎉 All words found!";
    }
  }
</script>
</body>
</html>`;
}