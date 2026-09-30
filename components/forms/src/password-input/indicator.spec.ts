import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed } from "#password-input/password-input.fixtures.tsx";

/**
 * Returns the name of the glyph the toggle renders.
 *
 * @returns The glyph's `data-glyph`, or nothing where the toggle renders none.
 */
function glyph(): string | undefined {
  return screen.getByRole("button").querySelector<HTMLElement>("[data-glyph]")?.dataset["glyph"];
}

describe("Indicator", () => {
  it("renders fallback while the value is hidden", async () => {
    await drawn(composed());

    expect(glyph()).toBe("eye");
  });

  it("renders its children while the value is shown", async () => {
    await drawn(composed({ defaultVisible: true }));

    expect(glyph()).toBe("eye-off");
  });
});
