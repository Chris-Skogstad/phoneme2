import { Locale } from "./locales";

export type WordleWord = {
  english: string;
  phonemes: string[];
};

export const wordleDifficultySettings = {
  easy: { label: "Easy", maxGuesses: 6 },
  medium: { label: "Medium", maxGuesses: 6 },
  hard: { label: "Hard", maxGuesses: 6 },
} as const;

export type WordleDifficulty = keyof typeof wordleDifficultySettings;

export const wordleWordsByLocale: Record<Locale, Record<WordleDifficulty, WordleWord>> = {
  au: {
    easy: { english: "CAR", phonemes: ["k", "ɑː"] },
    medium: { english: "BATH", phonemes: ["b", "ɑː", "θ"] },
    hard: { english: "WATER", phonemes: ["w", "ɔː", "t", "ə"] },
  },
  uk: {
    easy: { english: "CAR", phonemes: ["k", "ɑː"] },
    medium: { english: "BATH", phonemes: ["b", "ɑː", "θ"] },
    hard: { english: "WATER", phonemes: ["w", "ɔː", "t", "ə"] },
  },
  us: {
    easy: { english: "CAR", phonemes: ["k", "ɑ", "r"] },
    medium: { english: "BATH", phonemes: ["b", "æ", "θ"] },
    hard: { english: "WATER", phonemes: ["w", "ɑ", "ɾ", "ɚ"] },
  },
};