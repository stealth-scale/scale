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

  it("compiles a published theme's page and ink as the colors it states", () => {
    expect(declared(css, "[data-theme=cinder]", "--colors-bg")).toBe("#EEEEEE");
    expect(declared(css, "[data-theme=cinder]", "--colors-fg")).toBe("#303841");
    expect(declared(css, "[data-theme=blush]", "--colors-bg")).toBe("#F5F5F5");
    expect(declared(css, "[data-theme=ink]", "--colors-bg")).toBe("oklch(97.0% 0.0060 262.0)");
  });

  it("compiles a published theme's solid as the color it pins", () => {
    expect(declared(css, "[data-theme=cinder]", "--colors-red-solid")).toBe("#D72323");
    expect(declared(css, "[data-theme=cinder]", "--colors-primary-solid")).toBe(
      "var(--colors-red-solid)",
    );
    expect(declared(css, "[data-theme=neon]", "--colors-purple-solid")).toBe("#8C00FF");
  });

  it("states the preset of the application's own recipes", () => {
    expect(statement.presets?.map((each) => each.name)).toStrictEqual([
      "@stealthscale/example-theme-multiple",
    ]);
  });

  it("compiles the badge the application registers and abyss's extension of it", () => {
    expect(declared(css, ".badge", "border-radius")).toBe("var(--radii-l1)");
    expect(declared(css, "[data-theme=abyss] .badge", "text-transform")).toBe("uppercase");
    expect(declared(css, ".badge", "text-transform")).toBeUndefined();
  });

  it("compiles the default theme's page color where no attribute is set", () => {
    expect(declared(css, ":where(:root, :host)", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
  });

  it("compiles every theme's page color under its attribute", () => {
    expect(declared(css, "[data-theme=fathom]", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
    expect(declared(css, "[data-theme=folio]", "--colors-bg")).toBe("oklch(98.0% 0.0100 300.0)");
    expect(declared(css, "[data-theme=forge]", "--colors-bg")).toBe("oklch(96.0% 0.0200 75.0)");
    expect(declared(css, "[data-theme=abyss]", "--colors-bg")).toBe("oklch(93.0% 0.0200 195.0)");
  });

  it("restates the foundation's font under a theme that states none of its own", () => {
    expect(declared(css, "[data-theme=forge]", "--fonts-body")).toContain("ui-sans-serif");
    expect(declared(css, "[data-theme=folio]", "--fonts-body")).toContain("Georgia");
  });

  it("compiles the derived theme with its parent's values under its own attribute", () => {
    expect(declared(css, "[data-theme=abyss]", "--colors-teal-700")).toBe(
      declared(css, "[data-theme=fathom]", "--colors-teal-700"),
    );
    expect(declared(css, "[data-theme=abyss]", "--colors-primary-solid")).toBe(
      "var(--colors-indigo-solid)",
    );
  });

  it("compiles the button recipe the component package publishes", () => {
    expect(declared(css, ".button", "border-radius")).toBe("var(--radii-l2)");
    expect(css).toContain(".button--ghost");
  });

  it("compiles the hero compound under the name the recipe gave it and forge's extension of it", () => {
    expect(declared(css, ".button--hero", "letter-spacing")).toBe("var(--letter-spacings-wide)");
    expect(declared(css, "[data-theme=forge] .button--hero", "box-shadow")).toBe(
      "var(--shadows-xl)",
    );
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
    expect(declared(css, "[data-theme=forge] .card__header", "text-transform")).toBe("uppercase");
    expect(declared(css, "[data-theme=forge] .card__root--elevated", "box-shadow")).toBe(
      "var(--shadows-xl)",
    );
    expect(declared(css, ".card__header", "text-transform")).toBeUndefined();
  });

  it("compiles each theme's button extension under its attribute alone", () => {
    expect(declared(css, "[data-theme=forge] .button", "text-transform")).toBe("uppercase");
    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe(
      "var(--letter-spacings-wide)",
    );
    expect(declared(css, ".button", "text-transform")).toBeUndefined();
  });

  it("compiles the dark values under the attribute and under the preference", () => {
    expect(css).toContain("[data-color-mode=dark]");
    expect(css).toContain("@media (prefers-color-scheme: dark)");
  });

  it("declares the default theme's preferred dark values on the document root alone", () => {
    expect(
      declared(
        css,
        ":where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *)",
        "--colors-bg",
      ),
    ).toBe("oklch(11.0% 0.0160 195.0)");
  });

  it("declares a switched theme's preferred dark values on the element that carries it", () => {
    expect(
      declared(
        css,
        "[data-theme=abyss]:where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *)",
        "--colors-bg",
      ),
    ).toBe("oklch(6.0% 0.0200 195.0)");
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
