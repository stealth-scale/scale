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
  it("lists fathom first as the default and the published themes after the four examples", () => {
    expect(statement.themes.map((each) => each.name)).toStrictEqual([
      "fathom",
      "folio",
      "forge",
      "abyss",
      "ink",
      "cinder",
      "harbour",
      "admiral",
      "regatta",
      "pine",
      "carnival",
      "dusk",
      "neon",
      "blush",
    ]);
  });

  it("compiles a published theme's page and ink as the colors it states in each mode", () => {
    expect(declared(css, "[data-theme=cinder]", "--colors-bg")).toBe(
      "light-dark(#EEEEEE, #303841)",
    );
    expect(declared(css, "[data-theme=cinder]", "--colors-fg")).toBe(
      "light-dark(#303841, #EEEEEE)",
    );
    expect(declared(css, "[data-theme=blush]", "--colors-bg")).toMatch(/^light-dark\(#F5F5F5, /u);
    expect(declared(css, "[data-theme=ink]", "--colors-bg")).toBe(
      "light-dark(oklch(97.0% 0.0075 262.0), oklch(15.0% 0.0076 262.0))",
    );
  });

  it("compiles a published theme's primary as the color it states where that color carries its label", () => {
    expect(declared(css, "[data-theme=neon]", "--colors-primary-solid")).toMatch(
      /^light-dark\(#8C00FF, /u,
    );
    expect(declared(css, "[data-theme=neon]", "--colors-purple-solid")).toBe(
      declared(css, "[data-theme=neon]", "--colors-primary-solid"),
    );
  });

  it("compiles a published theme's primary as the brand stated it where it stands from the page", () => {
    expect(declared(css, "[data-theme=cinder]", "--colors-primary-solid")).toBe(
      "light-dark(#D72323, oklch(67.7% 0.1957 27.5))",
    );
    expect(declared(css, "[data-theme=cinder]", "--colors-red-solid")).toBe(
      declared(css, "[data-theme=cinder]", "--colors-primary-solid"),
    );
  });

  it("states the preset of the application's own recipes", () => {
    expect(statement.presets?.map((each) => each.name)).toStrictEqual([
      "@stealthscale/example-theme-multiple",
    ]);
  });

  it("compiles the badge the application registers and abyss's extension of it", () => {
    expect(declared(css, ".badge", "border-radius")).toBe("var(--radii-l1)");
    expect(
      declared(
        css,
        "[data-theme=abyss] .badge:not([data-theme=abyss] [data-theme] *)",
        "text-transform",
      ),
    ).toBe("uppercase");
    expect(declared(css, ".badge", "text-transform")).toBeUndefined();
  });

  it("compiles the default theme's page color where no attribute is set", () => {
    expect(declared(css, ":where(:root, :host)", "--colors-bg")).toBe(
      "light-dark(oklch(96.0% 0.0160 195.0), oklch(15.0% 0.0160 195.0))",
    );
  });

  it("compiles every theme's page color under its attribute", () => {
    expect(declared(css, "[data-theme=fathom]", "--colors-bg")).toMatch(
      /^light-dark\(oklch\(96\.0% 0\.0160 195\.0\), /u,
    );
    expect(declared(css, "[data-theme=folio]", "--colors-bg")).toMatch(
      /^light-dark\(oklch\(97\.5% 0\.0100 300\.0\), /u,
    );
    expect(declared(css, "[data-theme=forge]", "--colors-bg")).toMatch(
      /^light-dark\(oklch\(96\.0% 0\.0200 75\.0\), /u,
    );
    expect(declared(css, "[data-theme=abyss]", "--colors-bg")).toMatch(
      /^light-dark\(oklch\(93\.0% 0\.0200 195\.0\), /u,
    );
  });

  it("restates the foundation's font under a theme that states none of its own", () => {
    expect(declared(css, "[data-theme=forge]", "--fonts-body")).toContain("ui-sans-serif");
    expect(declared(css, "[data-theme=folio]", "--fonts-body")).toContain("Georgia");
  });

  it("compiles the derived theme with its parent's ink and its own primary under its own attribute", () => {
    expect(declared(css, "[data-theme=abyss]", "--colors-fg")).toBe(
      declared(css, "[data-theme=fathom]", "--colors-fg"),
    );
    expect(declared(css, "[data-theme=abyss]", "--colors-primary-solid")).toBe(
      "light-dark(oklch(47.0% 0.1372 280.0), oklch(72.0% 0.1316 280.0))",
    );
    expect(declared(css, "[data-theme=abyss]", "--colors-primary-solid")).not.toBe(
      declared(css, "[data-theme=fathom]", "--colors-primary-solid"),
    );
  });

  it("compiles the button recipe the component package publishes", () => {
    expect(declared(css, ".button", "border-radius")).toBe("var(--radii-l2)");
    expect(css).toContain(".button--ghost");
  });

  it("compiles the hero compound under the name the recipe gave it and forge's extension of it", () => {
    expect(declared(css, ".button--hero", "letter-spacing")).toBe("var(--letter-spacings-wide)");
    expect(
      declared(
        css,
        "[data-theme=forge] .button--hero:not([data-theme=forge] [data-theme] *)",
        "box-shadow",
      ),
    ).toBe("var(--shadows-xl)");
    expect(css).not.toContain("compound__");
  });

  it("compiles the square the icon button fixes through a default prop", () => {
    expect(declared(css, ".button--square", "aspect-ratio")).toBe("var(--aspect-ratios-square)");
    expect(declared(css, ".button--square", "padding-inline")).toBe("var(--spacing-0)");
  });

  it("compiles the card slot recipe the surfaces package publishes with one class per slot", () => {
    expect(declared(css, ".card__root", "border-radius")).toBe("var(--radii-l2)");
    expect(declared(css, ".card__root--subtle", "background")).toBe("var(--colors-bg-subtle)");
    expect(declared(css, ".card__header--lg", "font-size")).toBeDefined();
    expect(css).toContain(".card__footer");
  });

  it("compiles forge's card extension under its attribute alone on the band it names", () => {
    expect(
      declared(
        css,
        "[data-theme=forge] .card__header:not([data-theme=forge] [data-theme] *)",
        "text-transform",
      ),
    ).toBe("uppercase");
    expect(
      declared(
        css,
        "[data-theme=forge] .card__root--elevated:not([data-theme=forge] [data-theme] *)",
        "box-shadow",
      ),
    ).toBe("var(--shadows-xl)");
    expect(declared(css, ".card__header", "text-transform")).toBeUndefined();
  });

  it("compiles each theme's button extension under its attribute alone", () => {
    expect(
      declared(
        css,
        "[data-theme=forge] .button:not([data-theme=forge] [data-theme] *)",
        "text-transform",
      ),
    ).toBe("uppercase");
    expect(
      declared(
        css,
        "[data-theme=abyss] .button:not([data-theme=abyss] [data-theme] *)",
        "letter-spacing",
      ),
    ).toBe("var(--letter-spacings-wide)");
    expect(declared(css, ".button", "text-transform")).toBeUndefined();
  });

  it("declares no color under the dark attribute or the dark preference", () => {
    expect(declared(css, "[data-color-mode=dark]", "--colors-bg")).toBeUndefined();
    expect(
      declared(
        css,
        ":where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *)",
        "--colors-bg",
      ),
    ).toBeUndefined();
  });

  it("declares a switched theme's dark value inside the one declaration under its attribute", () => {
    expect(declared(css, "[data-theme=abyss]", "--colors-bg")).toBe(
      "light-dark(oklch(93.0% 0.0200 195.0), oklch(13.0% 0.0200 195.0))",
    );
  });

  it("states the color scheme on either color mode attribute", () => {
    expect(declared(css, "[data-color-mode=dark]", "color-scheme")).toBe("dark");
    expect(declared(css, "[data-color-mode=light]", "color-scheme")).toBe("light");
  });

  it("registers the angle the moving border sweeps through", () => {
    expect(css).toContain("@property --angle");
  });

  it("names the compiler nowhere in the stylesheet", () => {
    expect(css).not.toContain("panda");
  });
});
