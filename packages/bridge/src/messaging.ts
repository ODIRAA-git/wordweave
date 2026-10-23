import { createEnvelope, parseEnvelope } from "./guards";
import type { BridgeMessage } from "./protocol";

/** Sends a message to another window (host to game, or game to host). */
export function postBridgeMessage(
  target: Window,
  message: BridgeMessage,
  targetOrigin: string,
): void {
  target.postMessage(createEnvelope(message), targetOrigin);
}

export interface ListenOptions {
  /** Only messages from this origin are accepted, for example "https://games.example.com". */
  allowedOrigin: string;
  /** If set, only messages sent by this window are accepted. */
  expectedSource?: Window | null;
}

/** Listens for bridge messages. Returns a function that stops listening. */
export function listenForBridgeMessages(
  handler: (message: BridgeMessage) => void,
  options: ListenOptions,
): () => void {
  const onMessage = (event: MessageEvent): void => {
    if (event.origin !== options.allowedOrigin) return;
    if (options.expectedSource && event.source !== options.expectedSource) return;

    const envelope = parseEnvelope(event.data);
    if (!envelope) return;

    handler(envelope.message);
  };

  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
}
