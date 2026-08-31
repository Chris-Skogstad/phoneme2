"use client";

import { useEffect, useState } from "react";
import {
  generateGrid,
  WordSearchGrid,
  DIFFICULTY_SETTINGS,
  Difficulty,
} from "../lib/generateGrid";
import { generateWordSearchHTML } from "../lib/generateWordSearchHTML";
import { useLocale } from "../context/LocaleContext";
import { wordSearchWordsByLocale } from "../lib/wordSearchWords";
import { phonemeLegend } from "../lib/phonemeLegend";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";
import PhonemeTile from "../components/PhonemeTile";
import DifficultySelector from "../components/DifficultySelector";
import PageHeading from "../components/PageHeading";

const difficultyOptions = (Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
  (key) => ({ value: key, label: DIFFICULTY_SETTINGS[key].label })
);

export default function WordSearchPage() {
  const { locale } = useLocale();
  const wordSearchWords = wordSearchWordsByLocale[locale];

  const [gridData, setGridData] = useState<WordSearchGrid | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    setGridData(generateGrid(wordSearchWords, DIFFICULTY_SETTINGS[difficulty].size));
  }, [difficulty, locale]);

  const handleRefresh = () => {
    setGridData(generateGrid(wordSearchWords, DIFFICULTY_SETTINGS[difficulty].size));
    setShowAnswers(false);
  };

  const handleGenerate = () => {
    if (!gridData) return;
    const html = generateWordSearchHTML(gridData, wordSearchWords);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "phoneme-word-search.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!gridData) {
    return (
      <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <p className="text-gray-500">Generating word search...</p>
      </main>
    );
  }

  const answerCellKeys = new Set(
    showAnswers
      ? gridData.placements.flatMap((p) => p.cells.map((c) => `${c.row}-${c.col}`))
      : []
  );

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Word Search Builder"
        description="Preview the phoneme word search below, adjust difficulty, then download it as a standalone activity for students."
      />

      <DifficultySelector
        options={difficultyOptions}
        value={difficulty}
        onChange={setDifficulty}
      />

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {wordSearchWords.map((w) => (
          <Tooltip key={w.english} label={w.english}>
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md font-medium">
              {w.phonemes.join(" ")}
            </div>
          </Tooltip>
        ))}
      </div>

   <div
  className="grid gap-1 mb-6 mx-auto w-full"
  style={{
    gridTemplateColumns: `repeat(${gridData.grid.length}, minmax(0, 1fr))`,
    maxWidth: `${gridData.grid.length * 36 + (gridData.grid.length - 1) * 4}px`,
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

      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="secondary" onClick={handleRefresh}>
          Refresh
        </Button>
        <Button
          variant="warning"
          onClick={() => setShowAnswers((prev) => !prev)}
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Button>
        <Button variant="primary" onClick={handleGenerate}>
          Generate & Download
        </Button>
      </div>
    </main>
  );
}