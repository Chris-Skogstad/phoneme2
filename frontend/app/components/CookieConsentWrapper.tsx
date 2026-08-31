"use client";

import { useTheme } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import CookieConsent from "./CookieConsent";

export default function CookieConsentWrapper() {
  const { grantConsent: grantThemeConsent } = useTheme();
  const { grantConsent: grantLocaleConsent } = useLocale();

  const handleAccept = () => {
    grantThemeConsent();
    grantLocaleConsent();
  };

  return <CookieConsent onAccept={handleAccept} />;
}