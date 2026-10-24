export interface Level {
  id: number;
  word: string;
}

export const LEVELS: readonly Level[] = [
  { id: 1, word: "cat" },
  { id: 2, word: "sun" },
  { id: 3, word: "book" },
  { id: 4, word: "tree" },
  { id: 5, word: "fish" },
  { id: 6, word: "star" },
  { id: 7, word: "moon" },
  { id: 8, word: "house" },
  { id: 9, word: "apple" },
  { id: 10, word: "water" },
];

/** Returns the letters of `word` in random order. Never returns the solved word. */
export function shuffleLetters(word: string, random: () => number = Math.random): string[] {
  const target = word.toUpperCase();
  const letters = target.split("");

  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = letters[i];
    const b = letters[j];
    if (a === undefined || b === undefined) continue;
    letters[i] = b;
    letters[j] = a;
  }

  // If the shuffle happened to produce the solved word, rotate it by one letter.
  if (letters.length > 1 && letters.join("") === target) {
    const first = letters.shift();
    if (first !== undefined) letters.push(first);
  }

  return letters;
}

/** True if the placed letters spell the target word. */
export function isCorrect(attempt: readonly string[], word: string): boolean {
  return attempt.join("").toUpperCase() === word.toUpperCase();
}

/** 10 points per letter, minus 5 per mistake, never below 10. */
export function scoreForLevel(word: string, mistakes: number): number {
  return Math.max(10, word.length * 10 - mistakes * 5);
}
