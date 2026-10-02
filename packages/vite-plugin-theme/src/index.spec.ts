/**
 * Pins the names the entry point exports.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

describe("vite-plugin-theme", () => {
  it("exports exactly the names of the public surface", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual([
      "LAYER_DECLARATION",
      "SEPARATOR",
      "THEME_ATTRIBUTE",
      "theme",
    ]);
  });

  it("declares the cascade order in LAYER_DECLARATION", () => {
    expect(published.LAYER_DECLARATION).toBe("@layer reset, base, tokens, recipes, utilities;\n");
  });

  it("exports every theme plugin under the theme namespace", () => {
    expect(Object.keys(published.theme).toSorted()).toStrictEqual([
      "generator",
      "packed",
      "runtime",
      "stylesheet",
    ]);
  });
});
