"use client";

import { useCallback, useEffect, useState } from "react";
import AddWordForm from "../components/AddWordForm";
import WordListItem from "../components/WordListItem";
import PageHeading from "../components/PageHeading";
import { useLocale } from "../context/LocaleContext";
import { APIURL } from "../lib/config";

type Word = {
  id: string;
  text: string;
  locale: string;
  phonemes: string[];
  hint: string | null;
};

export default function WordBankPage() {
  const { locale } = useLocale();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = useCallback(() => {
    setLoading(true);
    fetch(`${APIURL}/api/words?locale=${locale}`)
      .then((res) => res.json())
      .then(setWords)
      .catch((err) => console.error("Error fetching words:", err))
      .finally(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Word Bank"
        description="Add, edit, or remove phoneme-based words in the shared word bank."
      />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
        <div className="w-full flex justify-center md:sticky md:top-8">
          <AddWordForm onWordAdded={fetchWords} />
        </div>

        <div className="flex flex-col gap-3 w-full items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Existing Words ({locale.toUpperCase()})
          </h3>
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading && words.length === 0 && (
            <p className="text-gray-500">No words yet for this locale.</p>
          )}
          {words.map((w) => (
            <WordListItem key={w.id} word={w} onChanged={fetchWords} />
          ))}
        </div>
      </div>
    </main>
  );
}