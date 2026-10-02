/**
 * Covers the rule the animation set turns on.
 */

import { describe, expect, it } from "vitest";

import { ANIMATION } from "#rules/animation.ts";

describe("animation", () => {
  it("sets plugin/no-low-performance-animation-properties to true", () => {
    expect(ANIMATION["plugin/no-low-performance-animation-properties"]).toBe(true);
  });
});
