import "./styles.css";
import { LEVELS, shuffleLetters } from "./game";
import { mascotSvg, sceneHtml } from "./scene";

interface Tile {
  id: number;
  char: string;
  used: boolean;
}

const app = document.getElementById("app");
const level = LEVELS[0];

if (app && level) {
  const state = {
    tiles: shuffleLetters(level.word).map((char, id): Tile => ({ id, char, used: false })),
    placed: [] as number[],
  };

  // The scene is drawn once, so its animations are never restarted.
  app.innerHTML = `${sceneHtml}<main class="card" id="card"></main>`;
  const card = document.getElementById("card");

  const render = (): void => {
    if (!card) return;

    const slots = level.word
      .split("")
      .map((_, index) => {
        const tileId = state.placed[index];
        const tile = state.tiles.find((t) => t.id === tileId);
        return `<span class="slot${tile ? " filled" : ""}">${tile ? tile.char : ""}</span>`;
      })
      .join("");

    const tiles = state.tiles
      .map(
        (t) =>
          `<button class="tile" type="button" data-id="${t.id}" aria-label="Letter ${t.char}"${
            t.used ? " disabled" : ""
          }>${t.char}</button>`,
      )
      .join("");

    card.innerHTML = `
      ${mascotSvg}
      <h1 class="title">LetterLoop</h1>
      <p class="hint">Help Weavey build the word from the letters.</p>
      <div class="meta">
        <span class="pill">Level ${level.id}</span>
        <span class="stars" aria-label="0 of 3 stars">☆☆☆</span>
      </div>
      <div class="slots" aria-label="Your answer">${slots}</div>
      <div class="tiles">${tiles}</div>
      <button class="button secondary" type="button" data-action="undo">Undo</button>
    `;

    card.querySelector<HTMLButtonElement>("button.tile:not(:disabled)")?.focus();
  };

  card?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const tileButton = target.closest<HTMLButtonElement>("button[data-id]");
    if (tileButton && state.placed.length < level.word.length) {
      const id = Number(tileButton.dataset.id);
      const tile = state.tiles.find((t) => t.id === id);
      if (tile && !tile.used) {
        tile.used = true;
        state.placed.push(id);
        render();
      }
      return;
    }

    if (target.closest("[data-action='undo']")) {
      const lastId = state.placed.pop();
      const tile = state.tiles.find((t) => t.id === lastId);
      if (tile) tile.used = false;
      render();
    }
  });

  render();
}
