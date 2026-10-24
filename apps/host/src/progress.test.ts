import { describe, expect, it } from "vitest";
import type { BridgeMessage } from "@wordweave/bridge";
import { summarize } from "./progress";

describe("summarize", () => {
  it("starts empty and not connected", () => {
    expect(summarize([])).toEqual({
      ready: false,
      score: 0,
      levelsCompleted: 0,
      lastLevelScore: null,
    });
  });

  it("marks the game as connected after GAME_READY", () => {
    const log: BridgeMessage[] = [{ type: "GAME_READY", gameId: "letterloop" }];
    expect(summarize(log).ready).toBe(true);
  });

  it("uses the latest score and counts completed levels", () => {
    const log: BridgeMessage[] = [
      { type: "GAME_READY", gameId: "letterloop" },
      { type: "SCORE_UPDATE", gameId: "letterloop", score: 30 },
      { type: "LEVEL_COMPLETE", gameId: "letterloop", level: 1, score: 30 },
      { type: "SCORE_UPDATE", gameId: "letterloop", score: 60 },
      { type: "LEVEL_COMPLETE", gameId: "letterloop", level: 2, score: 30 },
    ];

    expect(summarize(log)).toEqual({
      ready: true,
      score: 60,
      levelsCompleted: 2,
      lastLevelScore: 30,
    });
  });

  it("ignores messages that are meant for the game", () => {
    const log: BridgeMessage[] = [{ type: "SET_LANGUAGE", language: "de" }];
    expect(summarize(log).ready).toBe(false);
  });
});
