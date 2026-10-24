import { describe, expect, it } from "vitest";
import { LEVELS, isCorrect, scoreForLevel, shuffleLetters } from "./game";

describe("shuffleLetters", () => {
  it("keeps exactly the same letters", () => {
    const shuffled = shuffleLetters("apple");
    expect([...shuffled].sort()).toEqual(["A", "E", "L", "P", "P"]);
  });

  it("never returns the solved word", () => {
    for (const level of LEVELS) {
      for (let i = 0; i < 50; i++) {
        expect(shuffleLetters(level.word).join("")).not.toBe(level.word.toUpperCase());
      }
    }
  });

  it("rotates the letters if the shuffle leaves the word solved", () => {
    // A random function that always returns 0.999 keeps every letter in place.
    expect(shuffleLetters("cat", () => 0.999)).toEqual(["A", "T", "C"]);
  });
});

describe("isCorrect", () => {
  it("accepts the right letters in the right order", () => {
    expect(isCorrect(["C", "A", "T"], "cat")).toBe(true);
  });

  it("rejects letters in the wrong order", () => {
    expect(isCorrect(["A", "C", "T"], "cat")).toBe(false);
  });

  it("rejects an incomplete answer", () => {
    expect(isCorrect(["C", "A"], "cat")).toBe(false);
  });
});

describe("scoreForLevel", () => {
  it("gives 10 points per letter without mistakes", () => {
    expect(scoreForLevel("book", 0)).toBe(40);
  });

  it("takes 5 points off for each mistake", () => {
    expect(scoreForLevel("book", 2)).toBe(30);
  });

  it("never goes below 10", () => {
    expect(scoreForLevel("cat", 20)).toBe(10);
  });
});
