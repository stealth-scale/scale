/**
 * Pins the public surface, so an export cannot appear or disappear unnoticed.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

/**
 * Lists every export the package publishes.
 */
const SURFACE = ["layers", "rules", "warn", "workspace"];

describe("vite-config-css", () => {
  it("exports exactly the names SURFACE lists", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
