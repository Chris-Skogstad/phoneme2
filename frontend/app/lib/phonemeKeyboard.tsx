import { Locale } from "./locales";

const baseKeyboard: string[] = [
  "p", "b", "t", "d", "k", "g", "f", "v", "θ", "ð",
  "s", "z", "ʃ", "ʒ", "tʃ", "dʒ", "h", "m", "n", "ŋ",
  "l", "r", "w", "j", "ɪ", "e", "æ", "ʌ", "ɒ", "ʊ",
];

const localeSpecificKeys: Record<Locale, string[]> = {
  au: ["ɑː", "ɔː", "ə"],
  uk: ["ɑː", "ɔː", "ə"],
  us: ["ɑ", "ɾ", "ɚ"],
};

export function getPhonemeKeyboard(locale: Locale): string[] {
  return [...baseKeyboard, ...localeSpecificKeys[locale]];
}