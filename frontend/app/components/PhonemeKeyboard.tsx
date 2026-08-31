"use client";

import { getPhonemeKeyboard } from "../lib/phonemeKeyboard";
import { phonemeLegend } from "../lib/phonemeLegend";
import { useLocale } from "../context/LocaleContext";
import PhonemeTile from "./PhonemeTile";
import Button from "./Button";

type KeyState = "default" | "correct" | "wrong-position" | "absent";

type PhonemeKeyboardProps = {
  onKeyPress: (token: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  keyStates?: Record<string, KeyState>;
};

export default function PhonemeKeyboard({
  onKeyPress,
  onBackspace,
  onSubmit,
  disabled,
  keyStates = {},
}: PhonemeKeyboardProps) {
  const { locale } = useLocale();
  const keys = getPhonemeKeyboard(locale);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {keys.map((token) => (
          <PhonemeTile
            key={token}
            token={token}
            size="kb"
            state={keyStates[token] ?? "default"}
            hint={phonemeLegend[token]}
            onClick={() => onKeyPress(token)}
            disabled={disabled}
          />
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBackspace} disabled={disabled}>
          Backspace
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={disabled}>
          Enter
        </Button>
      </div>
    </div>
  );
}