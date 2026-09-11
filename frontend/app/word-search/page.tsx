"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  generateGrid,
  WordSearchGrid,
  DIFFICULTY_SETTINGS,
  Difficulty,
} from "../lib/generateGrid";
import { generateWordSearchHTML } from "../lib/generateWordSearchHTML";
import { useLocale } from "../context/LocaleContext";
import { phonemeLegend } from "../lib/phonemeLegend";
import { getApiUrl } from "../lib/config";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";
import PhonemeTile from "../components/PhonemeTile";
import DifficultySelector from "../components/DifficultySelector";
import PageHeading from "../components/PageHeading";

type BankWord = {
  id: string;
  text: string;
  phonemes: string[];
  hint: string | null;
};

const difficultyOptions = (Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
  (key) => ({ value: key, label: DIFFICULTY_SETTINGS[key].label })
);

function WordSearchPageInner() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const loadId = searchParams.get("id");

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [wordsLoading, setWordsLoading] = useState(true);

  const [gridData, setGridData] = useState<WordSearchGrid | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [creatorName, setCreatorName] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // fetch the word bank for this locale
  useEffect(() => {
    setWordsLoading(true);
    fetch(`${getApiUrl()}/api/words?locale=${locale}`)
      .then((res) => res.json())
      .then((data: BankWord[]) => {
        setBankWords(data);
        if (!loadId) {
          setSelectedIds(new Set(data.map((w) => w.id))); // default: all selected
        }
      })
      .catch((err) => console.error("Error fetching words:", err))
      .finally(() => setWordsLoading(false));
  }, [locale, loadId]);

  // if loading a saved activity, fetch it and apply its selection/settings
  useEffect(() => {
    if (!loadId) return;
    fetch(`${getApiUrl()}/api/word-searches?id=${loadId}`)
      .then((res) => res.json())
      .then((data: { title: string; difficulty: Difficulty; words: { id: string }[] }) => {
        setTitle(data.title);
        setDifficulty(data.difficulty);
        setSelectedIds(new Set(data.words.map((w) => w.id)));
      })
      .catch((err) => console.error("Error loading saved activity:", err));
  }, [loadId]);

  const selectedWords = bankWords
    .filter((w) => selectedIds.has(w.id))
    .map((w) => ({ english: w.text, phonemes: w.phonemes }));

  useEffect(() => {
    if (selectedWords.length === 0) {
      setGridData(null);
      return;
    }
    setGridData(generateGrid(selectedWords, DIFFICULTY_SETTINGS[difficulty].size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, locale, selectedIds, bankWords]);

  const toggleWord = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRefresh = () => {
    if (selectedWords.length === 0) return;
    setGridData(generateGrid(selectedWords, DIFFICULTY_SETTINGS[difficulty].size));
    setShowAnswers(false);
  };

  const handleGenerate = () => {
    if (!gridData) return;
    const html = generateWordSearchHTML(gridData, selectedWords);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "phoneme-word-search.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    if (!title.trim()) {
      setSaveError("Please enter a title for this word search.");
      return;
    }
    if (!loadId && !creatorName.trim()) {
      setSaveError("Please enter your name.");
      return;
    }
    if (selectedIds.size === 0) {
      setSaveError("Select at least one word first.");
      return;
    }

    setSaving(true);
    try {
      const res = loadId
        ? await fetch(`${getApiUrl()}/api/word-searches?id=${loadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title.trim(),
              difficulty,
              gridSize: DIFFICULTY_SETTINGS[difficulty].size,
              wordIds: Array.from(selectedIds),
            }),
          })
        : await fetch(`${getApiUrl()}/api/word-searches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title.trim(),
              difficulty,
              gridSize: DIFFICULTY_SETTINGS[difficulty].size,
              wordIds: Array.from(selectedIds),
              creatorName: creatorName.trim(),
            }),
          });

      if (!res.ok) {
        setSaveError(await res.text());
        return;
      }

      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
      setSaveError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  if (wordsLoading) {
    return (
      <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <p className="text-gray-500">Loading words...</p>
      </main>
    );
  }

  const answerCellKeys = new Set(
    showAnswers && gridData
      ? gridData.placements.flatMap((p) => p.cells.map((c) => `${c.row}-${c.col}`))
      : []
  );

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Word Search Builder"
        description="Pick which words to include, adjust difficulty, then download it as a standalone activity for students."
      />

      <DifficultySelector
        options={difficultyOptions}
        value={difficulty}
        onChange={setDifficulty}
      />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center mt-6 mb-8">
        <div className="w-full max-w-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Words to include ({selectedIds.size} selected)
          </h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
            {bankWords.length === 0 && (
              <p className="text-gray-500 text-sm">
                No words in the bank yet for this locale — add some on the Word Bank page.
              </p>
            )}
            {bankWords.map((w) => (
              <label key={w.id} className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={selectedIds.has(w.id)}
                  onChange={() => toggleWord(w.id)}
                />
                <span className="font-medium">{w.text}</span>
                <span className="text-gray-500">({w.phonemes.join(" ")})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full max-w-lg flex flex-col gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {loadId ? "Update this word search" : "Save this word search"}
          </h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. 'Sh Sound Practice')"
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={saving}
          />
          {!loadId && (
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Your name"
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={saving}
            />
          )}
          <Button variant="primary" onClick={handleSave} disabled={saving || selectedIds.size === 0}>
            {saving ? "Saving..." : loadId ? "Update Word Search" : "Save Word Search"}
          </Button>
          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
          {saveSuccess && <p className="text-green-500 text-sm">Saved!</p>}
        </div>
      </div>

      {selectedWords.length === 0 ? (
        <p className="text-gray-500 mb-6">Select at least one word to generate a grid.</p>
      ) : (
        <>
          <div className="flex gap-4 flex-wrap justify-center mb-6">
            {selectedWords.map((w) => (
              <Tooltip key={w.english} label={w.english}>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md font-medium">
                  {w.phonemes.join(" ")}
                </div>
              </Tooltip>
            ))}
          </div>

          {gridData && (
            <div
              className="grid gap-1 mb-6 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridData.grid.length}, minmax(0, 1fr))`,
                width: `${gridData.grid.length * 36 + (gridData.grid.length - 1) * 4}px`,
              }}
            >
              {gridData.grid.map((row, r) =>
                row.map((token, c) => {
                  const isAnswer = answerCellKeys.has(`${r}-${c}`);
                  return (
                    <PhonemeTile
                      key={`${r}-${c}`}
                      token={token}
                      state={isAnswer ? "answer" : "default"}
                      hint={phonemeLegend[token] ?? token}
                      size="responsive"
                    />
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="secondary" onClick={handleRefresh} disabled={selectedWords.length === 0}>
          Refresh
        </Button>
        <Button
          variant="warning"
          onClick={() => setShowAnswers((prev) => !prev)}
          disabled={selectedWords.length === 0}
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Button>
        <Button variant="primary" onClick={handleGenerate} disabled={!gridData}>
          Generate & Download
        </Button>
      </div>
    </main>
  );
}

export default function WordSearchPage() {
  return (
    <Suspense fallback={<p className="text-center py-10 text-gray-500">Loading...</p>}>
      <WordSearchPageInner />
    </Suspense>
  );
}