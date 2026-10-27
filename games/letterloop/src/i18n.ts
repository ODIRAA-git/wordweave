import type { Language } from "@wordweave/bridge";

const en = {
  hint: "Help Weavey build the word from the letters.",
  tryAgain: "Not quite. Try again!",
  wellDone: "Well done! +{points} points",
  level: "Level",
  score: "Score",
  undo: "Undo",
  nextLevel: "Next level",
  playAgain: "Play again",
  yourAnswer: "Your answer",
  letter: "Letter {char}",
  stars: "{count} of 3 stars",
};

export type MessageKey = keyof typeof en;

const de: Record<MessageKey, string> = {
  hint: "Hilf Weavey, das Wort aus den Buchstaben zu bauen.",
  tryAgain: "Nicht ganz. Versuch es noch einmal!",
  wellDone: "Gut gemacht! +{points} Punkte",
  level: "Stufe",
  score: "Punkte",
  undo: "Rückgängig",
  nextLevel: "Nächste Stufe",
  playAgain: "Nochmal spielen",
  yourAnswer: "Deine Antwort",
  letter: "Buchstabe {char}",
  stars: "{count} von 3 Sternen",
};

export const dictionaries: Record<Language, Record<MessageKey, string>> = { en, de };

/** Returns the text for `key` in the given language and fills in {placeholders}. */
export function t(
  language: Language,
  key: MessageKey,
  values: Record<string, string | number> = {},
): string {
  const template = dictionaries[language][key];
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    String(values[name] ?? placeholder),
  );
}
