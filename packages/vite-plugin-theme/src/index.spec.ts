/**
 * Pins the names the entry point exports.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

describe("vite-plugin-theme", () => {
  it("exports the theme namespace beside the naming constants and the layer declaration", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual([
      "LAYER_DECLARATION",
      "SEPARATOR",
      "THEME_ATTRIBUTE",
      "theme",
    ]);
    expect(published.LAYER_DECLARATION).toBe("@layer reset, base, tokens, recipes, utilities;\n");
    expect(Object.keys(published.theme).toSorted()).toStrictEqual([
      "generator",
      "packed",
      "runtime",
      "stylesheet",
    ]);
  });
});
