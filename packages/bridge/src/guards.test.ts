import { describe, expect, it } from "vitest";
import { createEnvelope, isBridgeMessage, parseEnvelope } from "./guards";

describe("isBridgeMessage", () => {
  it("accepts a valid LEVEL_COMPLETE message", () => {
    const message = { type: "LEVEL_COMPLETE", gameId: "letterloop", level: 1, score: 30 };
    expect(isBridgeMessage(message)).toBe(true);
  });

  it("rejects an unknown message type", () => {
    expect(isBridgeMessage({ type: "DELETE_EVERYTHING" })).toBe(false);
  });

  it("rejects a message with a missing field", () => {
    expect(isBridgeMessage({ type: "SCORE_UPDATE", gameId: "letterloop" })).toBe(false);
  });

  it("rejects a language that is not supported", () => {
    expect(isBridgeMessage({ type: "SET_LANGUAGE", language: "fr" })).toBe(false);
  });

  it("rejects values that are not objects", () => {
    expect(isBridgeMessage(null)).toBe(false);
    expect(isBridgeMessage("hello")).toBe(false);
    expect(isBridgeMessage(42)).toBe(false);
  });
});

describe("parseEnvelope", () => {
  it("returns the envelope for a valid message", () => {
    const envelope = createEnvelope({ type: "SET_LANGUAGE", language: "de" });
    expect(parseEnvelope(envelope)).toEqual(envelope);
  });

  it("returns null for a foreign protocol", () => {
    const foreign = { protocol: "other", version: 1, message: { type: "GAME_READY", gameId: "x" } };
    expect(parseEnvelope(foreign)).toBeNull();
  });

  it("returns null for a wrong version", () => {
    const wrong = {
      protocol: "wordweave",
      version: 99,
      message: { type: "GAME_READY", gameId: "x" },
    };
    expect(parseEnvelope(wrong)).toBeNull();
  });
});
