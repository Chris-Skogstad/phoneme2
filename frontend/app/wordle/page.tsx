"use client";

import { useEffect, useState } from "react";
import {
  wordleWordsByLocale,
  wordleDifficultySettings,
  WordleDifficulty,
} from "../lib/wordleWords";
import { evaluateGuess, computeKeyStates, GuessResult } from "../lib/wordleLogic";
import { generateWordleHTML } from "../lib/generateWordleHTML";
import { phonemeLegend } from "../lib/phonemeLegend";
import { useLocale } from "../context/LocaleContext";
import PageHeading from "../components/PageHeading";
import DifficultySelector from "../components/DifficultySelector";
import PhonemeTile from "../components/PhonemeTile";
import PhonemeKeyboard from "../components/PhonemeKeyboard";
import Button from "../components/Button";

const difficultyOptions = (
  Object.keys(wordleDifficultySettings) as WordleDifficulty[]
).map((key) => ({ value: key, label: wordleDifficultySettings[key].label }));

export default function WordlePage() {
  const { locale } = useLocale();
  const wordleWords = wordleWordsByLocale[locale];

  const [difficulty, setDifficulty] = useState<WordleDifficulty>("medium");
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [revealAnswer, setRevealAnswer] = useState(false);

  const target = wordleWords[difficulty];
  const maxGuesses = wordleDifficultySettings[difficulty].maxGuesses;

  useEffect(() => {
    setGuesses([]);
    setCurrentGuess([]);
    setStatus("playing");
    setRevealAnswer(false);
  }, [difficulty, locale]);

  const handleKeyPress = (token: string) => {
    if (status !== "playing") return;
    if (currentGuess.length < target.phonemes.length) {
      setCurrentGuess((prev) => [...prev, token]);
    }
  };

  const handleBackspace = () => {
    if (status !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (status !== "playing") return;
    if (currentGuess.length !== target.phonemes.length) return;

    const result = evaluateGuess(currentGuess, target.phonemes);
    const nextGuesses = [...guesses, result];
    setGuesses(nextGuesses);
    setCurrentGuess([]);

    const isWin = result.every((r) => r.state === "correct");
    if (isWin) {
      setStatus("won");
    } else if (nextGuesses.length >= maxGuesses) {
      setStatus("lost");
    }
  };

  const handleNewGame = () => {
    setGuesses([]);
    setCurrentGuess([]);
    setStatus("playing");
  };

 const handleGenerate = () => {
  const html = generateWordleHTML(target, maxGuesses, locale);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = "phoneme-wordle.html";
  link.click();
  URL.revokeObjectURL(url);
};

const keyStates = computeKeyStates(guesses);

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Wordle Builder"
        description="Preview the phoneme Wordle activity below, adjust difficulty, then download it as a standalone game for students."
      />

      <DifficultySelector
        options={difficultyOptions}
        value={difficulty}
        onChange={setDifficulty}
      />

      {revealAnswer && (
  <div className="mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-md font-medium phoneme-text">
    Answer: {target.phonemes.join(" ")} → {target.english}
  </div>
)}

      <div className="flex flex-col gap-1 mb-4">
        {Array.from({ length: maxGuesses }).map((_, r) => (
          <div key={r} className="flex gap-1">
            {Array.from({ length: target.phonemes.length }).map((_, c) => {
              let token = "";
              let state: "default" | "correct" | "wrong-position" | "absent" = "default";

              if (r < guesses.length) {
                token = guesses[r][c].token;
                state = guesses[r][c].state;
              } else if (r === guesses.length && c < currentGuess.length) {
                token = currentGuess[c];
              }

              return (
              <PhonemeTile
  key={c}
  token={token}
  state={token ? state : "default"}
  hint={token ? phonemeLegend[token] : undefined}
  size="lg"
/>
              );
            })}
          </div>
        ))}
      </div>

      <div className="min-h-[1.5em] mb-4 font-bold text-center">
        {status === "won" && (
          <span className="text-green-600 dark:text-green-400">
            🎉 Correct! {target.phonemes.join(" ")} → {target.english}
          </span>
        )}
        {status === "lost" && (
          <span className="text-red-600 dark:text-red-400">
            Out of guesses. The word was {target.phonemes.join(" ")} →{" "}
            {target.english}
          </span>
        )}
      </div>

      <PhonemeKeyboard
  onKeyPress={handleKeyPress}
  onBackspace={handleBackspace}
  onSubmit={handleSubmit}
  disabled={status !== "playing"}
  keyStates={keyStates}
/>

      <div className="flex gap-3 flex-wrap justify-center mt-6">
        <Button variant="secondary" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="warning" onClick={() => setRevealAnswer((prev) => !prev)}>
          {revealAnswer ? "Hide Answer" : "Reveal Answer"}
        </Button>
        <Button variant="primary" onClick={handleGenerate}>
          Generate & Download
        </Button>
      </div>
    </main>
  );
}