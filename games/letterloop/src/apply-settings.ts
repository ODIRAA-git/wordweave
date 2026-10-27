import type { A11ySettings } from "@wordweave/bridge";
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
