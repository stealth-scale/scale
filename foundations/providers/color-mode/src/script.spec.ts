import { describe, expect, it, vi } from "vitest";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { colorModeScript } from "#script.ts";

/**
 * Runs the text the way a browser runs the body of an inline script element.
 */
function run(text: string): void {
  // eslint-disable-next-line typescript/no-implied-eval, typescript/no-unsafe-call -- running the text is the only way to check what a browser does with it
  new Function(text)();
}

/**
 * Runs the script against this document, with the storage a case describes in place of the page's.
 */
function ran(app: string, stored: Readonly<Record<string, string>>): null | string {
  vi.stubGlobal("localStorage", { getItem: (key: string) => stored[key] ?? null });
  document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);

  run(colorModeScript(app));

  return document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE);
}

describe("colorModeScript", () => {
  it("writes the attribute for a mode somebody chose", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "dark" })).toBe("dark");
  });

  it("writes the other mode just as readily", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "light" })).toBe("light");
  });

  it("leaves the page to the stylesheet where nobody has chosen", () => {
    expect(ran("docs", {})).toBeNull();
  });

  it("leaves the page to the stylesheet for a choice to follow the machine", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "system" })).toBeNull();
  });

  it("leaves the page to the stylesheet for anything that is not a mode", () => {
    expect(ran("docs", { "stealth.docs.color-mode": "sepia" })).toBeNull();
  });

  it("reads only the application it was given", () => {
    expect(ran("docs", { "stealth.console.color-mode": "dark" })).toBeNull();
  });

  it("draws the page rather than failing where storage refuses to answer", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("the browser refuses storage in a private window");
      },
    });

    expect(() => {
      run(colorModeScript("docs"));
    }).not.toThrow();
  });

  it("writes no angle bracket so an HTML parser keeps the whole text inside the element", () => {
    const text = colorModeScript('docs</script><img src=x onerror="alert(1)">');
    const parsed = new DOMParser().parseFromString(
      `<head><script>${text}</script></head>`,
      "text/html",
    );

    expect(text).not.toContain("<");
    expect(parsed.scripts).toHaveLength(1);
    expect(parsed.scripts[0]?.textContent).toBe(text);
    expect(parsed.querySelector("img")).toBeNull();
  });

  it("reads the stored choice for an application whose name carries an angle bracket", () => {
    expect(ran("a<b", { "stealth.a<b.color-mode": "dark" })).toBe("dark");
  });
});
