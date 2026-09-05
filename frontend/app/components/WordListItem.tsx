"use client";

import { useState } from "react";
import PhonemeTile from "./PhonemeTile";
import PhonemeKeyboard from "./PhonemeKeyboard";
import Button from "./Button";
import { APIURL } from "../lib/config";

type Word = {
  id: string;
  text: string;
  locale: string;
  phonemes: string[];
  hint: string | null;
};

type Props = {
  word: Word;
  onChanged: () => void;
};

export default function WordListItem({ word, onChanged }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(word.text);
  const [hint, setHint] = useState(word.hint ?? "");
  const [phonemes, setPhonemes] = useState<string[]>(word.phonemes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setText(word.text);
    setHint(word.hint ?? "");
    setPhonemes(word.phonemes);
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setError(null);
    if (!text.trim() || phonemes.length === 0) {
      setError("Word and phonemes can't be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${APIURL}/api/words?id=${word.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim().toUpperCase(), hint: hint.trim() || null, phonemes }),
      });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      setEditing(false);
      onChanged();
    } catch (err) {
      console.error(err);
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${word.text}" from the word bank?`)) return;
    try {
      const res = await fetch(`${APIURL}/api/words?id=${word.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert(await res.text());
        return;
      }
      onChanged();
    } catch (err) {
      console.error(err);
      alert("Could not reach the server.");
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full max-w-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Hint"
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <div className="flex gap-2 flex-wrap">
          {phonemes.map((p, i) => (
            <PhonemeTile key={i} token={p} size="sm" />
          ))}
        </div>
        <PhonemeKeyboard
          onKeyPress={(t) => setPhonemes((prev) => [...prev, t])}
          onBackspace={() => setPhonemes((prev) => prev.slice(0, -1))}
          onSubmit={handleSave}
          disabled={saving}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md w-full max-w-lg">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-900 dark:text-white">{word.text}</span>
        <div className="flex gap-1">
          {word.phonemes.map((p, i) => (
            <PhonemeTile key={i} token={p} size="sm" />
          ))}
        </div>
        {word.hint && <span className="text-sm text-gray-500">({word.hint})</span>}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={startEdit}>
          Edit
        </Button>
        <Button variant="warning" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}