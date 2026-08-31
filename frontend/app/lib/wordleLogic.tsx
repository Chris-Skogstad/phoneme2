export type TileState = "correct" | "wrong-position" | "absent";

export type GuessResult = {
  token: string;
  state: TileState;
};

export function evaluateGuess(guess: string[], target: string[]): GuessResult[] {
  const result: GuessResult[] = guess.map((token) => ({
    token,
    state: "absent" as TileState,
  }));
  const remaining = [...target];

  guess.forEach((token, i) => {
    if (token === target[i]) {
      result[i].state = "correct";
      remaining[i] = "__used__";
    }
  });

  guess.forEach((token, i) => {
    if (result[i].state === "correct") return;
    const idx = remaining.indexOf(token);
    if (idx !== -1) {
      result[i].state = "wrong-position";
      remaining[idx] = "__used__";
    }
  });

  return result;
}
export function computeKeyStates(
  guesses: GuessResult[][]
): Record<string, "correct" | "wrong-position" | "absent"> {
  const priority = { absent: 0, "wrong-position": 1, correct: 2 };
  const states: Record<string, "correct" | "wrong-position" | "absent"> = {};

  guesses.forEach((guess) => {
    guess.forEach(({ token, state }) => {
      const existing = states[token];
      if (!existing || priority[state] > priority[existing]) {
        states[token] = state;
      }
    });
  });

  return states;
}