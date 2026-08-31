export type Locale = "au" | "uk" | "us";

export const localeSettings: Record<Locale, { label: string }> = {
  au: { label: "Australian" },
  uk: { label: "British" },
  us: { label: "American" },
};