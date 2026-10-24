import {
  listenForBridgeMessages,
  postBridgeMessage,
  type BridgeMessage,
  type GameToHostMessage,
  type HostToGameMessage,
} from "@wordweave/bridge";

export interface HostLink {
  /** True when the game runs inside a host page. */
  readonly connected: boolean;
  send(message: GameToHostMessage): void;
}

const HOST_MESSAGE_TYPES: readonly string[] = ["SET_LANGUAGE", "SET_THEME", "SET_A11Y"];

const isHostMessage = (message: BridgeMessage): message is HostToGameMessage =>
  HOST_MESSAGE_TYPES.includes(message.type);

/** Reads the host's origin from the page address, e.g. ?host=http://localhost:5174 */
function readHostOrigin(): string | null {
  const value = new URLSearchParams(window.location.search).get("host");
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Connects the game to its host page. When the game is opened on its own
 * (no host), it returns a link that quietly does nothing.
 */
export function connectToHost(onMessage: (message: HostToGameMessage) => void): HostLink {
  const hostOrigin = readHostOrigin();
  const hostWindow = window.parent;

  if (!hostOrigin || hostWindow === window) {
    return { connected: false, send: () => undefined };
  }

  listenForBridgeMessages(
    (message) => {
      if (isHostMessage(message)) onMessage(message);
    },
    { allowedOrigin: hostOrigin, expectedSource: hostWindow },
  );

  return {
    connected: true,
    send: (message) => postBridgeMessage(hostWindow, message, hostOrigin),
  };
}
