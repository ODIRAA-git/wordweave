import "./styles.css";
import { LEVELS, isCorrect, scoreForLevel, shuffleLetters } from "./game";
import { mascotSvg, sceneHtml } from "./scene";
import { connectToHost } from "./host-link";

interface Tile {
  id: number;
  char: string;
  used: boolean;
}

type Status = "playing" | "wrong" | "won";

const starsFor = (mistakes: number): number => (mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1);
const GAME_ID = "letterloop";

const app = document.getElementById("app");

if (app) {
  // The scene is drawn once, so its animations are never restarted.
  app.innerHTML = `${sceneHtml}<main class="card" id="card"></main>`;
  const card = document.getElementById("card");

  let levelIndex = 0;
  let tiles: Tile[] = [];
  let placed: number[] = [];
  let mistakes = 0;
  let levelScore = 0;
  let totalScore = 0;
  let status: Status = "playing";

  // Messages from the host (language, theme, accessibility) will be handled in a later commit.
  const host = connectToHost(() => undefined);

  const render = (): void => {
    if (!card) return;
    const level = LEVELS[levelIndex];
    if (!level) return;

    const slots = level.word
      .split("")
      .map((_, index) => {
        const tile = tiles.find((t) => t.id === placed[index]);
        const classes = ["slot"];
        if (tile) classes.push("filled");
        if (status === "won") classes.push("correct");
        return `<span class="${classes.join(" ")}">${tile ? tile.char : ""}</span>`;
      })
      .join("");

    const tileButtons = tiles
      .map(
        (t) =>
          `<button class="tile" type="button" data-id="${t.id}" aria-label="Letter ${t.char}"${
            t.used ? " disabled" : ""
          }>${t.char}</button>`,
      )
      .join("");

    const stars = status === "won" ? starsFor(mistakes) : 0;
    const starText = "★".repeat(stars) + "☆".repeat(3 - stars);

    const message =
      status === "won"
        ? `<p class="hint success" aria-live="polite">Well done! +${levelScore} points</p>`
        : status === "wrong"
          ? `<p class="hint try-again" aria-live="polite">Not quite. Try again!</p>`
          : `<p class="hint" aria-live="polite">Help Weavey build the word from the letters.</p>`;

    const isLast = levelIndex === LEVELS.length - 1;
    const action =
      status === "won"
        ? `<button class="button" type="button" data-action="next">${
            isLast ? "Play again" : "Next level"
          }</button>`
        : `<button class="button secondary" type="button" data-action="undo">Undo</button>`;

    card.innerHTML = `
      ${mascotSvg}
      <h1 class="title">LetterLoop</h1>
      ${message}
      <div class="meta">
        <span class="pill">Level ${level.id}</span>
        <span class="pill">Score ${totalScore}</span>
        <span class="stars" aria-label="${stars} of 3 stars">${starText}</span>
      </div>
      <div class="slots${status === "wrong" ? " shake" : ""}" aria-label="Your answer">${slots}</div>
      <div class="tiles">${tileButtons}</div>
      ${action}
    `;

    const focusTarget =
      status === "won"
        ? card.querySelector<HTMLButtonElement>("[data-action='next']")
        : card.querySelector<HTMLButtonElement>("button.tile:not(:disabled)");
    focusTarget?.focus();
  };

  const startLevel = (index: number): void => {
    const level = LEVELS[index];
    if (!level) return;
    levelIndex = index;
    tiles = shuffleLetters(level.word).map((char, id): Tile => ({ id, char, used: false }));
    placed = [];
    mistakes = 0;
    levelScore = 0;
    status = "playing";
    render();
  };

  const checkAnswer = (word: string): void => {
    const attempt = placed.map((id) => tiles.find((t) => t.id === id)?.char ?? "");
    if (isCorrect(attempt, word)) {
      status = "won";
      levelScore = scoreForLevel(word, mistakes);
      totalScore += levelScore;
      host.send({ type: "SCORE_UPDATE", gameId: GAME_ID, score: totalScore });
      host.send({
        type: "LEVEL_COMPLETE",
        gameId: GAME_ID,
        level: levelIndex + 1,
        score: levelScore,
      });
      return;
    }
    mistakes += 1;
    status = "wrong";
    placed = [];
    tiles.forEach((t) => {
      t.used = false;
    });
  };

  const placeTile = (id: number): void => {
    const level = LEVELS[levelIndex];
    const tile = tiles.find((t) => t.id === id);
    if (!level || !tile || tile.used || placed.length >= level.word.length) return;

    tile.used = true;
    placed.push(id);
    status = "playing";
    if (placed.length === level.word.length) checkAnswer(level.word);
    render();
  };

  card?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (status === "won") {
      if (target.closest("[data-action='next']")) {
        if (levelIndex === LEVELS.length - 1) {
          totalScore = 0;
          startLevel(0);
        } else {
          startLevel(levelIndex + 1);
        }
      }
      return;
    }

    const tileButton = target.closest<HTMLButtonElement>("button[data-id]");
    if (tileButton) {
      placeTile(Number(tileButton.dataset.id));
      return;
    }

    if (target.closest("[data-action='undo']")) {
      const lastId = placed.pop();
      const tile = tiles.find((t) => t.id === lastId);
      if (tile) tile.used = false;
      status = "playing";
      render();
    }
  });

  host.send({ type: "GAME_READY", gameId: GAME_ID });
  startLevel(0);
}
