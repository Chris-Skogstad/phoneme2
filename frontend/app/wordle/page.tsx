"use client";

import { useEffect, useState } from "react";
import { wordleDifficultySettings, WordleDifficulty, WordleWord } from "../lib/wordleWords";
import { evaluateGuess, computeKeyStates, GuessResult } from "../lib/wordleLogic";
import { generateWordleHTML } from "../lib/generateWordleHTML";
import { phonemeLegend } from "../lib/phonemeLegend";
import { useLocale } from "../context/LocaleContext";
import { APIURL } from "../lib/config";
import PageHeading from "../components/PageHeading";
import DifficultySelector from "../components/DifficultySelector";
import PhonemeTile from "../components/PhonemeTile";
import PhonemeKeyboard from "../components/PhonemeKeyboard";
import Button from "../components/Button";

type BankWord = {
  id: string;
  text: string;
  phonemes: string[];
  hint: string | null;
};

const difficultyOptions = (
  Object.keys(wordleDifficultySettings) as WordleDifficulty[]
).map((key) => ({ value: key, label: wordleDifficultySettings[key].label }));

export default function WordlePage() {
  const { locale } = useLocale();

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wordsLoading, setWordsLoading] = useState(true);

  const [difficulty, setDifficulty] = useState<WordleDifficulty>("medium");
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [revealAnswer, setRevealAnswer] = useState(false);

  const maxGuesses = wordleDifficultySettings[difficulty].maxGuesses;

  // fetch the word bank for this locale
  useEffect(() => {
    setWordsLoading(true);
    fetch(`${APIURL}/api/words?locale=${locale}`)
      .then((res) => res.json())
      .then((data: BankWord[]) => {
        setBankWords(data);
        setSelectedId(data.length > 0 ? data[0].id : null); // default: first word
      })
      .catch((err) => console.error("Error fetching words:", err))
      .finally(() => setWordsLoading(false));
  }, [locale]);

  const selectedWord: WordleWord | null = (() => {
    const w = bankWords.find((w) => w.id === selectedId);
    return w ? { english: w.text, phonemes: w.phonemes } : null;
  })();

  // reset the game whenever the target or difficulty/locale changes
  useEffect(() => {
  setGuesses([]);
  setCurrentGuess([]);
  setStatus("playing");
}, [selectedId, difficulty, locale]);

  const selectWord = (id: string) => {
    setSelectedId(id);
  };

  const handleKeyPress = (token: string) => {
    if (status !== "playing" || !selectedWord) return;
    if (currentGuess.length < selectedWord.phonemes.length) {
      setCurrentGuess((prev) => [...prev, token]);
    }
  };

  const handleBackspace = () => {
    if (status !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (status !== "playing" || !selectedWord) return;
    if (currentGuess.length !== selectedWord.phonemes.length) return;

    const result = evaluateGuess(currentGuess, selectedWord.phonemes);
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
    setRevealAnswer(false);
  };

  const handleGenerate = () => {
    if (!selectedWord) return;
    const html = generateWordleHTML(selectedWord, maxGuesses, locale);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "phoneme-wordle.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const keyStates = computeKeyStates(guesses);

  if (wordsLoading) {
    return (
      <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <p className="text-gray-500">Loading words...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Wordle Builder"
        description="Pick the target word, adjust difficulty, then download it as a standalone game for students."
      />

      <DifficultySelector
        options={difficultyOptions}
        value={difficulty}
        onChange={setDifficulty}
      />

      <div className="w-full max-w-lg mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Target word
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
                type="radio"
                name="wordleTarget"
                checked={selectedId === w.id}
                onChange={() => selectWord(w.id)}
              />
              <span className="font-medium">{w.text}</span>
              <span className="text-gray-500">({w.phonemes.join(" ")})</span>
            </label>
          ))}
        </div>
      </div>

      {!selectedWord ? (
        <p className="text-gray-500 mb-6">Select a word to play.</p>
      ) : (
        <>
          {revealAnswer && (
            <div className="mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-md font-medium phoneme-text">
              Answer: {selectedWord.phonemes.join(" ")} → {selectedWord.english}
            </div>
          )}

          <div className="flex flex-col gap-1 mb-4">
            {Array.from({ length: maxGuesses }).map((_, r) => (
              <div key={r} className="flex gap-1">
                {Array.from({ length: selectedWord.phonemes.length }).map((_, c) => {
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
                🎉 Correct! {selectedWord.phonemes.join(" ")} → {selectedWord.english}
              </span>
            )}
            {status === "lost" && (
              <span className="text-red-600 dark:text-red-400">
                Out of guesses. The word was {selectedWord.phonemes.join(" ")} →{" "}
                {selectedWord.english}
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
        </>
      )}

      <div className="flex gap-3 flex-wrap justify-center mt-6">
        <Button variant="secondary" onClick={handleNewGame} disabled={!selectedWord}>
          New Game
        </Button>
        <Button
          variant="warning"
          onClick={() => setRevealAnswer((prev) => !prev)}
          disabled={!selectedWord}
        >
          {revealAnswer ? "Hide Answer" : "Reveal Answer"}
        </Button>
        <Button variant="primary" onClick={handleGenerate} disabled={!selectedWord}>
          Generate & Download
        </Button>
      </div>
    </main>
  );
}