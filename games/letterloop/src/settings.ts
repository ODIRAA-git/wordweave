import type { A11ySettings } from "@wordweave/bridge";

export const DEFAULT_A11Y: A11ySettings = {
  dyslexiaFont: false,
  letterSpacing: 0,
  lineHeight: 1.6,
  reducedMotion: false,
};

const DEFAULT_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// Widely available fonts with clear, open letter shapes.
const READABLE_FONT = 'Verdana, "Trebuchet MS", Tahoma, sans-serif';

/** Turns accessibility settings into the CSS variable values the game's styles use. */
export function a11yToCssVariables(settings: A11ySettings): Record<string, string> {
  return {
    "--font-body": settings.dyslexiaFont ? READABLE_FONT : DEFAULT_FONT,
    "--letter-spacing": `${settings.letterSpacing}em`,
    "--line-height": String(settings.lineHeight),
  };
}
