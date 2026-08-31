import { Locale } from "./locales";

export type PhonemeWord = {
  english: string;
  phonemes: string[];
};

export const wordSearchWordsByLocale: Record<Locale, PhonemeWord[]> = {
  au: [
    { english: "SHIP", phonemes: ["ʃ", "ɪ", "p"] },
    { english: "CHIN", phonemes: ["tʃ", "ɪ", "n"] },
    { english: "RING", phonemes: ["r", "ɪ", "ŋ"] },
    { english: "FISH", phonemes: ["f", "ɪ", "ʃ"] },
    { english: "CAR", phonemes: ["k", "ɑː"] },
  ],
  uk: [
    { english: "SHIP", phonemes: ["ʃ", "ɪ", "p"] },
    { english: "CHIN", phonemes: ["tʃ", "ɪ", "n"] },
    { english: "RING", phonemes: ["r", "ɪ", "ŋ"] },
    { english: "FISH", phonemes: ["f", "ɪ", "ʃ"] },
    { english: "CAR", phonemes: ["k", "ɑː"] },
  ],
  us: [
    { english: "SHIP", phonemes: ["ʃ", "ɪ", "p"] },
    { english: "CHIN", phonemes: ["tʃ", "ɪ", "n"] },
    { english: "RING", phonemes: ["r", "ɪ", "ŋ"] },
    { english: "FISH", phonemes: ["f", "ɪ", "ʃ"] },
    { english: "CAR", phonemes: ["k", "ɑ", "r"] },
  ],
};