import { describe, expect, it } from "vitest";

import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { canonical } from "#draw/palette.ts";

describe("foundation", () => {
  it("fixes the pages as the ends of the grey ramp", () => {
    expect(PAGES).toStrictEqual({
      dark: "oklch(15.0% 0.0076 262.0)",
      light: "oklch(97.0% 0.0075 262.0)",
    });
  });

  it("writes each page in the other", () => {
    expect(FOUNDATION.light).toStrictEqual({ ink: PAGES.dark, page: PAGES.light });
    expect(FOUNDATION.dark).toStrictEqual({ ink: PAGES.light, page: PAGES.dark });
  });

  it("draws the primary from the canonical blue and every hue palette", () => {
    expect(FOUNDATION.primary).toStrictEqual(canonical("blue"));
    expect(FOUNDATION.hues).toBe(true);
  });
});
