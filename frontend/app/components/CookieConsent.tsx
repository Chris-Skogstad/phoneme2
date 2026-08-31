"use client";

import { useEffect, useState } from "react";
import Button from "./Button";

export default function CookieConsent({
  onAccept,
}: {
  onAccept: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsented = document.cookie.includes("cookie-consent=true");
    if (!hasConsented) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    document.cookie = "cookie-consent=true; path=/; max-age=31536000";
    setVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-bold mb-2 text-center">Cookie Notice</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
          This site uses cookies to remember your light/dark mode and
          phoneme style (Australian/British/American) preferences. No
          personal data or tracking is involved.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleDecline} className="flex-1">
            Decline
          </Button>
          <Button variant="primary" onClick={handleAccept} className="flex-1">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}