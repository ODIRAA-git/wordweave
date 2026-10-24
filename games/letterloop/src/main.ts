import "./styles.css";
import { mascotSvg, sceneHtml } from "./scene";

const app = document.getElementById("app");

if (app) {
  app.innerHTML = `
    ${sceneHtml}
    <main class="card">
      ${mascotSvg}
      <h1 class="title">LetterLoop</h1>
      <p class="hint">Help Weavey build the word from the letters.</p>
      <div class="meta">
        <span class="pill">Level 1</span>
        <span class="stars" aria-label="0 of 3 stars">☆☆☆</span>
      </div>
      <div class="tiles" aria-hidden="true">
        <span class="tile">C</span>
        <span class="tile">A</span>
        <span class="tile">T</span>
      </div>
      <button class="button" type="button">Start</button>
    </main>
  `;
}
