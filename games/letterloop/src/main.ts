import "./styles.css";

const app = document.getElementById("app");

if (app) {
  app.innerHTML = `
    <div class="scene" aria-hidden="true">
      <span class="cloud" style="--y: 10%; --t: 55s; --d: -10s"></span>
      <span class="cloud" style="--y: 28%; --t: 75s; --d: -45s"></span>
      <span class="cloud" style="--y: 55%; --t: 65s; --d: -25s"></span>
            <span class="float-letter" style="--x: 7%; --y: 18%; --size: 4.5rem; --d: 0s; --c: #f59a8fe6">A</span>
      <span class="float-letter" style="--x: 88%; --y: 14%; --size: 3.5rem; --d: -2s; --c: #b69cf0e6">W</span>
      <span class="float-letter" style="--x: 80%; --y: 60%; --size: 5rem; --d: -4s; --c: #f4c95de6">B</span>
      <span class="float-letter" style="--x: 12%; --y: 62%; --size: 3.8rem; --d: -1s; --c: #6fb4f0e6">E</span>
      <span class="float-letter" style="--x: 46%; --y: 5%; --size: 3rem; --d: -3s; --c: #5fb89be6">S</span>
      <svg class="hills" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#9ad9bf" d="M0 200 C240 120 480 120 720 190 C960 260 1200 250 1440 160 L1440 320 L0 320Z" />
        <path fill="#5fb89b" d="M0 250 C300 190 560 230 820 260 C1080 290 1260 240 1440 210 L1440 320 L0 320Z" />
      </svg>
    </div>
    <main class="card">
      <svg class="mascot" viewBox="0 0 120 120" role="img" aria-label="Weavey, the WordWeave mascot">
        <ellipse cx="60" cy="110" rx="30" ry="6" fill="#1f2a44" opacity="0.12" />
        <path d="M60 16c26 0 44 20 44 46s-16 46-44 46S16 88 16 62 34 16 60 16z" fill="#8fd3c8" />
        <path d="M60 16c-8-12 10-17 8-7s-14 5-8 7" stroke="#f4c95d" stroke-width="4" fill="none" stroke-linecap="round" />
        <circle cx="44" cy="58" r="11" fill="#fff" />
        <circle cx="76" cy="58" r="11" fill="#fff" />
        <circle cx="46" cy="60" r="6.5" fill="#1f2a44" />
        <circle cx="78" cy="60" r="6.5" fill="#1f2a44" />
        <circle cx="48.5" cy="57.5" r="2.2" fill="#fff" />
        <circle cx="80.5" cy="57.5" r="2.2" fill="#fff" />
        <ellipse cx="30" cy="74" rx="6" ry="4" fill="#f4a6a0" opacity="0.75" />
        <ellipse cx="90" cy="74" rx="6" ry="4" fill="#f4a6a0" opacity="0.75" />
        <path d="M51 77q9 9 18 0" stroke="#1f2a44" stroke-width="3.5" fill="none" stroke-linecap="round" />
      </svg>
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
