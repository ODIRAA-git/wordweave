export const PROTOCOL = "wordweave" as const;
export const PROTOCOL_VERSION = 1 as const;

export type Language = "en" | "de";
export type Theme = "light" | "soft" | "dark";

export interface A11ySettings {
  dyslexiaFont: boolean;
  letterSpacing: number; // in em, e.g. 0.1
  lineHeight: number; // unitless, e.g. 1.6
  reducedMotion: boolean;
}

/** Messages a game sends to the host. */
export type GameToHostMessage =
  | { type: "GAME_READY"; gameId: string }
  | { type: "SCORE_UPDATE"; gameId: string; score: number }
  | { type: "LEVEL_COMPLETE"; gameId: string; level: number; score: number };

/** Messages the host sends to a game. */
export type HostToGameMessage =
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "SET_THEME"; theme: Theme }
  | { type: "SET_A11Y"; settings: A11ySettings };

export type BridgeMessage = GameToHostMessage | HostToGameMessage;

/** Every message is wrapped in an envelope so we can recognise our own traffic. */
export interface Envelope<T extends BridgeMessage = BridgeMessage> {
  protocol: typeof PROTOCOL;
  version: typeof PROTOCOL_VERSION;
  message: T;
}
