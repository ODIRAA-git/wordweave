import { useEffect, useRef, useState } from "react";
import { listenForBridgeMessages, type BridgeMessage } from "@wordweave/bridge";

const HOST_ORIGIN = window.location.origin;
const GAME_ORIGIN = "http://localhost:5173";
const GAME_URL = `${GAME_ORIGIN}/?host=${encodeURIComponent(HOST_ORIGIN)}`;

export function App() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [log, setLog] = useState<BridgeMessage[]>([]);

  useEffect(() => {
    // Only accept messages from the game's origin and from this exact iframe.
    return listenForBridgeMessages((message) => setLog((previous) => [...previous, message]), {
      allowedOrigin: GAME_ORIGIN,
      expectedSource: frameRef.current?.contentWindow,
    });
  }, []);

  return (
    <main>
      <h1>WordWeave</h1>
      <iframe
        ref={frameRef}
        src={GAME_URL}
        title="LetterLoop game"
        width="560"
        height="760"
        sandbox="allow-scripts allow-same-origin"
      />
      <h2>Messages from the game</h2>
      <ol>
        {log.map((message, index) => (
          <li key={index}>
            <code>{JSON.stringify(message)}</code>
          </li>
        ))}
      </ol>
    </main>
  );
}
