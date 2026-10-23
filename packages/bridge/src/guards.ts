import {
  PROTOCOL,
  PROTOCOL_VERSION,
  type A11ySettings,
  type BridgeMessage,
  type Envelope,
  type Language,
  type Theme,
} from "./protocol";

const LANGUAGES: readonly Language[] = ["en", "de"];
const THEMES: readonly Theme[] = ["light", "soft", "dark"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function isA11ySettings(value: unknown): value is A11ySettings {
  return (
    isRecord(value) &&
    typeof value.dyslexiaFont === "boolean" &&
    typeof value.letterSpacing === "number" &&
    typeof value.lineHeight === "number" &&
    typeof value.reducedMotion === "boolean"
  );
}

/** True only if `value` is exactly one of the messages defined in the protocol. */
export function isBridgeMessage(value: unknown): value is BridgeMessage {
  if (!isRecord(value) || typeof value.type !== "string") return false;

  switch (value.type) {
    case "GAME_READY":
      return typeof value.gameId === "string";
    case "SCORE_UPDATE":
      return typeof value.gameId === "string" && typeof value.score === "number";
    case "LEVEL_COMPLETE":
      return (
        typeof value.gameId === "string" &&
        Number.isInteger(value.level) &&
        typeof value.score === "number"
      );
    case "SET_LANGUAGE":
      return LANGUAGES.includes(value.language as Language);
    case "SET_THEME":
      return THEMES.includes(value.theme as Theme);
    case "SET_A11Y":
      return isA11ySettings(value.settings);
    default:
      return false;
  }
}

/** Wraps a message in the envelope that is sent over postMessage. */
export function createEnvelope<T extends BridgeMessage>(message: T): Envelope<T> {
  return { protocol: PROTOCOL, version: PROTOCOL_VERSION, message };
}

/** Returns the envelope if `data` is a valid WordWeave envelope, otherwise null. */
export function parseEnvelope(data: unknown): Envelope | null {
  if (!isRecord(data)) return null;
  if (data.protocol !== PROTOCOL || data.version !== PROTOCOL_VERSION) return null;
  if (!isBridgeMessage(data.message)) return null;
  return { protocol: PROTOCOL, version: PROTOCOL_VERSION, message: data.message };
}
