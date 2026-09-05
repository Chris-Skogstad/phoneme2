"use client";

import { useState } from "react";
import PhonemeKeyboard from "./PhonemeKeyboard";
import PhonemeTile from "./PhonemeTile";
import Button from "./Button";
import { useLocale } from "../context/LocaleContext";
import { APIURL } from "../lib/config";

type Props = {
  onWordAdded?: () => void;
};

export default function AddWordForm({ onWordAdded }: Props) {
  const { locale } = useLocale();
  const [text, setText] = useState("");
  const [phonemes, setPhonemes] = useState<string[]>([]);
  const [hint, setHint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleKeyPress = (token: string) => {
    setPhonemes((prev) => [...prev, token]);
  };

  const handleBackspace = () => {
    setPhonemes((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!text.trim()) {
      setError("Please enter the word's spelling.");
      return;
    }
    if (phonemes.length === 0) {
      setError("Please build the phoneme sequence using the keyboard.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${APIURL}/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim().toUpperCase(),
          locale,
          phonemes,
          hint: hint.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to add word.");
        return;
      }

      setText("");
      setPhonemes([]);
      setHint("");
      setSuccess(true);
      onWordAdded?.();
    } catch (err) {
      console.error(err);
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Add a Word ({locale.toUpperCase()})
      </h3>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Word spelling (e.g. SHIP)"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        disabled={submitting}
      />

      <input
        type="text"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="Optional hint (e.g. 'a boat')"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        disabled={submitting}
      />

      <div className="flex gap-2 flex-wrap justify-center min-h-[3rem] items-center">
        {phonemes.length === 0 && (
          <span className="text-gray-400 text-sm">Tap phonemes below to build the sequence</span>
        )}
        {phonemes.map((p, i) => (
  <PhonemeTile key={i} token={p} state="default" size="md" />
))}
      </div>

      <PhonemeKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        disabled={submitting}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Word added!</p>}
    </div>
  );
}