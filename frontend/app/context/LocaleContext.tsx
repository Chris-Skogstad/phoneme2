"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Locale } from "../lib/locales";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  hasConsent: boolean;
  grantConsent: () => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(document.cookie.includes("cookie-consent=true"));
  }, []);

  useEffect(() => {
    if (hasConsent) {
      document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    }
  }, [locale, hasConsent]);

  const setLocale = (newLocale: Locale) => setLocaleState(newLocale);
  const grantConsent = () => setHasConsent(true);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, hasConsent, grantConsent }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}