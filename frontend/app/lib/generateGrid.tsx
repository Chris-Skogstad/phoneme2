import { PhonemeWord } from "./wordSearchWords";

export const DIFFICULTY_SETTINGS = {
  easy: { size: 8, label: "Easy" },
  medium: { size: 10, label: "Medium" },
  hard: { size: 14, label: "Hard" },
} as const;

export type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

export type Placement = {
  word: string; // the english label, used as the identifier
  tokens: string[];
  cells: { row: number; col: number }[];
};

export type WordSearchGrid = {
  grid: string[][]; // each cell holds one phoneme token
  placements: Placement[];
};

const DIRECTIONS = [
  { dr: 0, dc: 1 }, // right
  { dr: 1, dc: 0 }, // down
  { dr: 1, dc: 1 }, // diagonal down-right
];

const FILLER_PHONEMES = [
  "p", "b", "t", "d", "k", "g", "f", "v", "θ", "ð",
  "s", "z", "ʃ", "ʒ", "h", "m", "n", "ŋ", "l", "r",
  "w", "j", "ɪ", "e", "æ", "ʌ", "ɒ", "ʊ",
];

export function generateGrid(words: PhonemeWord[], size = 10): WordSearchGrid {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );
  const placements: Placement[] = [];

  const sortedWords = [...words].sort(
    (a, b) => b.phonemes.length - a.phonemes.length
  );

  for (const word of sortedWords) {
    const tokens = word.phonemes;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      const endRow = row + direction.dr * (tokens.length - 1);
      const endCol = col + direction.dc * (tokens.length - 1);
      if (endRow >= size || endCol >= size) continue;

      const cells: { row: number; col: number }[] = [];
      let fits = true;

      for (let i = 0; i < tokens.length; i++) {
        const r = row + direction.dr * i;
        const c = col + direction.dc * i;
        const existing = grid[r][c];
        if (existing !== "" && existing !== tokens[i]) {
          fits = false;
          break;
        }
        cells.push({ row: r, col: c });
      }

      if (fits) {
        cells.forEach((cell, i) => {
          grid[cell.row][cell.col] = tokens[i];
        });
        placements.push({ word: word.english, tokens, cells });
        placed = true;
      }
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") {
        grid[r][c] =
          FILLER_PHONEMES[Math.floor(Math.random() * FILLER_PHONEMES.length)];
      }
    }
  }

  return { grid, placements };
}