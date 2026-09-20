import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, declared, hookContext, started, transformed } from "@stealthscale/testing";
import { LAYER_DECLARATION, theme } from "@stealthscale/vite-plugin-theme";

import statement from "./theme.config.ts";

const CONDITIONS = ["stealth-source", "node"];

async function compile(): Promise<string> {
  const plugin = theme.stylesheet();
  const context = hookContext();

  await configured(plugin, {
    root: import.meta.dirname,
    ssr: { resolve: { conditions: CONDITIONS } },
  });
  await started(plugin, context);

  return (
    (await transformed(
      plugin,
      context,
      LAYER_DECLARATION,
      join(import.meta.dirname, "styles.css"),
    )) ?? ""
  );
}

const css = await compile();

describe("theme.config", () => {
  it("lists fathom alone", () => {
    expect(statement.themes.map((each) => each.name)).toStrictEqual(["fathom"]);
  });

  it("compiles the theme's page color in both modes where no attribute is set", () => {
    expect(declared(css, ":where(:root, :host)", "--colors-bg")).toBe(
      "light-dark(oklch(96.0% 0.0160 195.0), oklch(15.0% 0.0160 195.0))",
    );
  });

  it("compiles the theme under its attribute as well", () => {
    expect(declared(css, "[data-theme=fathom]", "--colors-bg")).toBe(
      "light-dark(oklch(96.0% 0.0160 195.0), oklch(15.0% 0.0160 195.0))",
    );
  });

  it("declares no color under the color mode attribute", () => {
    expect(declared(css, "[data-color-mode=dark]", "--colors-bg")).toBeUndefined();
  });

  it("states the color scheme on either color mode attribute", () => {
    expect(declared(css, "[data-color-mode=dark]", "color-scheme")).toBe("dark");
    expect(declared(css, "[data-color-mode=light]", "color-scheme")).toBe("light");
  });

  it("compiles the button recipe the component package publishes", () => {
    expect(declared(css, ".button", "border-radius")).toBe("var(--radii-l2)");
    expect(css).toContain(".button--outline");
  });

  it("names the compiler nowhere in the stylesheet", () => {
    expect(css).not.toContain("panda");
  });
});
