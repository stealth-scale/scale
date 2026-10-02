import { describe, expect, it, vi } from "vitest";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { colorModeScript } from "#script.ts";

/**
 * Evaluates the script text the way a browser evaluates the body of an inline script element.
 */
function run(text: string): void {
  // eslint-disable-next-line typescript/no-implied-eval, typescript/no-unsafe-call -- running the text is the only way to check what a browser does with it
  new Function(text)();
}

/**
 * Runs the script against this document with local storage stubbed, and returns the attribute it
 * left behind.
 */
function ran(app: string, stored: Readonly<Record<string, string>>): null | string {
  vi.stubGlobal("localStorage", { getItem: (key: string) => stored[key] ?? null });
  document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);

  run(colorModeScript(app));

  return document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE);
}

describe("colorModeScript", () => {
  it("writes dark into the attribute when the stored choice is dark", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "dark" })).toBe("dark");
  });

  it("writes light into the attribute when the stored choice is light", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "light" })).toBe("light");
  });

  it("writes no attribute when storage holds no choice", () => {
    expect(ran("docs", {})).toBeNull();
  });

  it("writes no attribute when the stored choice is system", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "system" })).toBeNull();
  });

  it("writes no attribute when the stored value is not a mode", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "sepia" })).toBeNull();
  });

  it("writes no attribute when the key names another application", () => {
    expect(ran("docs", { "stealth.console.color-mode": "dark" })).toBeNull();
  });

  it("runs without throwing when local storage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("the browser refuses storage in a private window");
      },
    });

    expect(() => {
      run(colorModeScript("docs"));
    }).not.toThrow();
  });

  it("writes no angle bracket into the script text", () => {
    expect(colorModeScript('docs</script><img src=x onerror="alert(1)">')).not.toContain("<");
  });

  it("cannot break out of the script element it is embedded in", () => {
    const text = colorModeScript('docs</script><img src=x onerror="alert(1)">');
    const parsed = new DOMParser().parseFromString(
      `<head><script>${text}</script></head>`,
      "text/html",
    );

    expect(parsed.scripts).toHaveLength(1);
    expect(parsed.scripts[0]?.textContent).toBe(text);
    expect(parsed.querySelector("img")).toBeNull();
  });

  it("matches the storage key when the application name contains an angle bracket", () => {
    expect(ran("a<b", { "stealth.a<b.color-mode": "dark" })).toBe("dark");
  });
});
