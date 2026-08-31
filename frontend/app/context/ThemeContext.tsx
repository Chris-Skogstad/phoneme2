"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  hasConsent: boolean;
  grantConsent: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(document.cookie.includes("cookie-consent=true"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (hasConsent) {
      document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    }
  }, [theme, hasConsent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const grantConsent = () => {
    setHasConsent(true);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, hasConsent, grantConsent }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}