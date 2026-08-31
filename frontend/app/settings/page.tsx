"use client";

import { useTheme } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { localeSettings, Locale } from "../lib/locales";
import PageHeading from "../components/PageHeading";
import Toggle from "../components/Toggle";
import DifficultySelector from "../components/DifficultySelector";

const localeOptions = (Object.keys(localeSettings) as Locale[]).map((key) => ({
  value: key,
  label: localeSettings[key].label,
}));

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Settings"
        description="Customize your experience with the phoneme activity builder."
      />

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mb-4 transition-colors">
        <Toggle
          checked={theme === "dark"}
          onChange={toggleTheme}
          label={theme === "dark" ? "Dark Mode" : "Light Mode"}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm transition-colors">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Phoneme Style
        </h3>
        <DifficultySelector
          options={localeOptions}
          value={locale}
          onChange={setLocale}
        />
      </div>
    </main>
  );
}