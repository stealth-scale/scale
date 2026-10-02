/**
 * Covers the boundary between the rules this package declares and the rules
 * the installed shared guide declares.
 */

import { describe, expect, it } from "vitest";

import { all, ANIMATION, CASCADE, ORDER, SELECTOR } from "#rules/index.ts";

/**
 * The rules this package deliberately leaves to the shared guide.
 *
 * @remarks
 *   A rule dropped from the shared guide upstream is a rule nobody enforces.
 *   The specification reads the installed guide, so the drop fails a test
 *   here.
 */
const SHARED = [
  "selector-class-pattern",
  "length-zero-no-unit",
  "color-hex-length",
  "shorthand-property-no-redundant-values",
  "declaration-block-no-redundant-longhand-properties",
];

/**
 * Loads the rules the installed copy of the shared guide turns on.
 *
 * @remarks
 *   Imported rather than restated, so an upgrade that moves a rule fails a test
 *   here.
 * @returns The guide's rule map, keyed by rule name.
 */
async function standard(): Promise<Record<string, unknown>> {
  const held = await import("stylelint-config-standard");

  return held.default.rules;
}

describe("vite-config-css", () => {
  it("returns exactly the rule names the four sets declare", () => {
    expect(Object.keys(all()).toSorted()).toStrictEqual(
      [
        ...Object.keys(SELECTOR),
        ...Object.keys(CASCADE),
        ...Object.keys(ORDER),
        ...Object.keys(ANIMATION),
      ].toSorted(),
    );
  });

  it("declares nothing the shared set already declares", async () => {
    const held = await standard();

    for (const name of Object.keys(all())) {
      expect(Object.keys(held), `${name} is already in the shared set`).not.toContain(name);
    }
  });

  it("finds every rule it leaves to the shared set still declared there", async () => {
    const held = await standard();

    for (const name of SHARED) {
      expect(Object.keys(held), `${name} is no longer in the shared set`).toContain(name);
    }
  });
});
