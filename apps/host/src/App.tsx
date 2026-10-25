import { useEffect, useMemo, useRef, useState } from "react";
import { listenForBridgeMessages, type BridgeMessage } from "@wordweave/bridge";
import { summarize } from "./progress";
import "./styles.css";

const HOST_ORIGIN = window.location.origin;
const GAME_ORIGIN = "http://localhost:5173";
const GAME_URL = `${GAME_ORIGIN}/?host=${encodeURIComponent(HOST_ORIGIN)}`;

export function App() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [log, setLog] = useState<BridgeMessage[]>([]);
  const progress = useMemo(() => summarize(log), [log]);

  useEffect(() => {
    // Only accept messages from the game's origin and from this exact iframe.
    return listenForBridgeMessages((message) => setLog((previous) => [...previous, message]), {
      allowedOrigin: GAME_ORIGIN,
      expectedSource: frameRef.current?.contentWindow,
    });
  }, []);

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

        <aside className="panel" aria-label="Progress">
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
