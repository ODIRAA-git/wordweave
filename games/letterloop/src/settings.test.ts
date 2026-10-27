import { describe, expect, it } from "vitest";
import { DEFAULT_A11Y, a11yToCssVariables } from "./settings";

describe("a11yToCssVariables", () => {
  it("uses the standard font by default", () => {
    const variables = a11yToCssVariables(DEFAULT_A11Y);
    expect(variables["--font-body"]).toContain("system-ui");
  });

  it("switches to a more readable font when the dyslexia font is on", () => {
    const variables = a11yToCssVariables({ ...DEFAULT_A11Y, dyslexiaFont: true });
    expect(variables["--font-body"]).toContain("Verdana");
  });

  it("converts letter spacing to em units", () => {
    const variables = a11yToCssVariables({ ...DEFAULT_A11Y, letterSpacing: 0.12 });
    expect(variables["--letter-spacing"]).toBe("0.12em");
  });

  it("passes the line height through as a plain number", () => {
    const variables = a11yToCssVariables({ ...DEFAULT_A11Y, lineHeight: 1.9 });
    expect(variables["--line-height"]).toBe("1.9");
  });
});
