import type { A11ySettings, Theme } from "@wordweave/bridge";
import { a11yToCssVariables } from "./settings";

/** Applies accessibility settings to the page by updating its CSS variables. */
export function applyA11y(
  settings: A11ySettings,
  root: HTMLElement = document.documentElement,
): void {
  for (const [name, value] of Object.entries(a11yToCssVariables(settings))) {
    root.style.setProperty(name, value);
  }
  root.dataset.reduceMotion = String(settings.reducedMotion);
}
/** Applies a colour theme by setting data-theme, which the stylesheet reacts to. */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = theme;
}
