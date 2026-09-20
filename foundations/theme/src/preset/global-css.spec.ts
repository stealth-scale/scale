import { describe, expect, it } from "vitest";

import { globalCss, SWITCHED } from "#preset/global-css.ts";

describe("globalCss", () => {
  it("selects the root and every element that switches a theme or a mode", () => {
    expect(SWITCHED).toBe(":root, [data-theme], [data-color-mode]");
  });

  it("fills the eight properties the reset and the focus ring read on every switched element", () => {
    expect(globalCss[SWITCHED]).toMatchObject({
      "--focus-ring-offset": "{spacing.ring}",
      "--focus-ring-width": "{borderWidths.ring}",
      "--global-color-border": "colors.border",
      "--global-color-focus-ring": "colors.border.focus",
      "--global-color-placeholder": "colors.fg.muted",
      "--global-color-selection": "colors.accent.muted",
      "--global-font-body": "fonts.body",
      "--global-font-mono": "fonts.mono",
    });
  });

  it("draws a native control's own accent in the accent palette", () => {
    expect(globalCss[SWITCHED]).toMatchObject({ accentColor: "accent.solid" });
  });

  it("declares the ink and the palette and the font again on every switched element", () => {
    expect(globalCss[SWITCHED]).toMatchObject({
      color: "fg",
      colorPalette: "neutral",
      fontFamily: "body",
    });
  });

  it("draws the page on its own surface in the light scheme", () => {
    expect(globalCss["html"]).toMatchObject({ background: "bg", colorScheme: "light" });
  });

  it("follows the dark mode attribute with the color scheme", () => {
    expect(globalCss["[data-color-mode=dark]"]).toStrictEqual({ colorScheme: "dark" });
  });

  it("follows the light mode attribute with the color scheme", () => {
    expect(globalCss["[data-color-mode=light]"]).toStrictEqual({ colorScheme: "light" });
  });

  it("sets the density property under the density attribute", () => {
    expect(globalCss["[data-density=compact]"]).toStrictEqual({ "--density": "0.9" });
    expect(globalCss["[data-density=comfortable]"]).toStrictEqual({ "--density": "1.1" });
  });

  it("scrolls smoothly and jumps for a reader who asked for less motion", () => {
    expect(globalCss["html"]).toMatchObject({
      "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
      scrollBehavior: "smooth",
    });
  });

  it("reads a bare heading in the heading role of its level", () => {
    expect(globalCss).toMatchObject({
      h1: { textStyle: "heading.xl" },
      h2: { textStyle: "heading.lg" },
      h3: { textStyle: "heading.md" },
      "h4, h5, h6": { textStyle: "heading.sm" },
    });
  });

  it("follows the dark preference with the color scheme where the page writes no light mode", () => {
    expect(globalCss["html"]).toMatchObject({
      "@media (prefers-color-scheme: dark)": {
        "&:not([data-color-mode=light])": { colorScheme: "dark" },
      },
    });
  });
});
