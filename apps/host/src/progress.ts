import type { BridgeMessage } from "@wordweave/bridge";

export interface Progress {
  ready: boolean;
  score: number;
  levelsCompleted: number;
  lastLevelScore: number | null;
}

/** Turns the list of bridge messages into the numbers shown on the progress panel. */
export function summarize(log: readonly BridgeMessage[]): Progress {
  let progress: Progress = { ready: false, score: 0, levelsCompleted: 0, lastLevelScore: null };
  const completed = new Set<number>();

  for (const message of log) {
    if (message.type === "GAME_READY") {
      progress = { ...progress, ready: true };
    } else if (message.type === "SCORE_UPDATE") {
      progress = { ...progress, score: message.score };
    } else if (message.type === "LEVEL_COMPLETE") {
      completed.add(message.level);
      progress = {
        ...progress,
        levelsCompleted: completed.size,
        lastLevelScore: message.score,
      };
    }
  }

  return progress;
}
