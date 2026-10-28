import { useEffect, useMemo, useRef, useState } from "react";
import {
  listenForBridgeMessages,
  postBridgeMessage,
  type A11ySettings,
  type BridgeMessage,
  type Language,
} from "@wordweave/bridge";
import { SettingsPanel } from "./SettingsPanel";
import { summarize } from "./progress";
import "./styles.css";

const HOST_ORIGIN = window.location.origin;
const GAME_ORIGIN = "http://localhost:5173";
const GAME_URL = `${GAME_ORIGIN}/?host=${encodeURIComponent(HOST_ORIGIN)}`;

const DEFAULT_A11Y: A11ySettings = {
  dyslexiaFont: false,
  letterSpacing: 0,
  lineHeight: 1.6,
  reducedMotion: false,
};

export function App() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [log, setLog] = useState<BridgeMessage[]>([]);
  const [a11y, setA11y] = useState<A11ySettings>(DEFAULT_A11Y);
  const a11yRef = useRef(a11y);
  const [language, setLanguage] = useState<Language>("en");
  const languageRef = useRef(language);
  const progress = useMemo(() => summarize(log), [log]);

  const sendSettings = (settings: A11ySettings): void => {
    const gameWindow = frameRef.current?.contentWindow;
    if (gameWindow) {
      postBridgeMessage(gameWindow, { type: "SET_A11Y", settings }, GAME_ORIGIN);
    }
  };
  const sendLanguage = (value: Language): void => {
    const gameWindow = frameRef.current?.contentWindow;
    if (gameWindow) {
      postBridgeMessage(gameWindow, { type: "SET_LANGUAGE", language: value }, GAME_ORIGIN);
    }
  };

  useEffect(() => {
    // Only accept messages from the game's origin and from this exact iframe.
    return listenForBridgeMessages(
      (message) => {
        setLog((previous) => [...previous, message]);
        // When the game announces itself, give it the current settings.
        if (message.type === "GAME_READY") {
          sendSettings(a11yRef.current);
          sendLanguage(languageRef.current);
        }
      },
      {
        allowedOrigin: GAME_ORIGIN,
        expectedSource: frameRef.current?.contentWindow,
      },
    );
  }, []);

  const handleSettingsChange = (settings: A11ySettings): void => {
    setA11y(settings);
    a11yRef.current = settings;
    sendSettings(settings);
  };
  const handleLanguageChange = (value: Language): void => {
    setLanguage(value);
    languageRef.current = value;
    sendLanguage(value);
  };

  return (
    <div className="page">
      <header className="header">
        <h1 className="brand">WordWeave</h1>
        <p className="tagline">Accessible learning games, woven together.</p>
      </header>

      <div className="layout">
        <section className="stage">
          <iframe
            ref={frameRef}
            src={GAME_URL}
            title="LetterLoop game"
            sandbox="allow-scripts allow-same-origin"
          />
        </section>

        <aside className="panel" aria-label="Progress and settings">
          <h2>Progress</h2>
          <p className={progress.ready ? "status online" : "status"} aria-live="polite">
            {progress.ready ? "Game connected" : "Waiting for the game"}
          </p>

          <dl className="stats">
            <div className="stat">
              <dt>Score</dt>
              <dd>{progress.score}</dd>
            </div>
            <div className="stat">
              <dt>Levels done</dt>
              <dd>{progress.levelsCompleted}</dd>
            </div>
            <div className="stat">
              <dt>Last level</dt>
              <dd>{progress.lastLevelScore ?? "–"}</dd>
            </div>
          </dl>

          <SettingsPanel
            settings={a11y}
            onChange={handleSettingsChange}
            language={language}
            onLanguageChange={handleLanguageChange}
          />

          <details className="dev">
            <summary>Developer view: bridge messages</summary>
            <ol>
              {log.map((message, index) => (
                <li key={index}>
                  <code>{JSON.stringify(message)}</code>
                </li>
              ))}
            </ol>
          </details>
        </aside>
      </div>
    </div>
  );
}
