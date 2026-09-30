import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { framed } from "#heat/heat.fixtures.tsx";
import { Key } from "#heat/key.tsx";
import { RAMP } from "#heat/recipe.ts";
import { type Paint } from "#heat/scale.ts";

/**
 * Returns a sequential scale over 0 to 405 in the first series color.
 */
function paintOf(changes: Partial<Paint> = {}): Paint {
  return {
    color: "series.1",
    colors: { negative: "orange", positive: "blue" },
    domain: { max: 405, min: 0 },
    midpoint: 0,
    scale: "sequential",
    ...changes,
  };
}

/**
 * Writes a value with a unit, so a case tells a written value apart.
 */
function write(value: unknown): string {
  return `${String(value)} u`;
}

/**
 * Renders a key and returns its element.
 */
function keyed(changes: Partial<Paint> = {}): HTMLElement {
  const { container } = render(
    framed(<Key label="Authorisations" paint={paintOf(changes)} write={write} />),
  );

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the frame renders the one key
  return container.querySelector(".heat__key") as HTMLElement;
}

describe("Key", () => {
  it("writes the name the low value and the high value in order", () => {
    expect(keyed().textContent).toBe("Authorisations0 u405 u");
  });

  it("paints the bar from its custom property", () => {
    keyed();

    expect(document.querySelector<HTMLElement>(".heat__bar")?.style.getPropertyValue(RAMP)).toBe(
      "color-mix(in oklab, var(--colors-series-1) 12%, var(--colors-bg-panel)), color-mix(in oklab, var(--colors-series-1) 100%, var(--colors-bg-panel))",
    );
  });

  it("hides the bar from assistive technology", () => {
    keyed();

    expect(document.querySelector(".heat__bar")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("writes a diverging scale's midpoint after the ends", () => {
    expect(keyed({ domain: { max: 8, min: -2 }, scale: "diverging" }).textContent).toBe(
      "Authorisations-8 u8 u0 u",
    );
  });

  it("writes no midpoint for a sequential scale", () => {
    keyed();

    expect(screen.queryByText("0 u", { selector: ".heat__midpoint" })).toBeNull();
  });

  it("writes the midpoint in its own part", () => {
    keyed({ domain: { max: 8, min: -2 }, scale: "diverging" });

    expect(screen.getByText("0 u").className).toContain("heat__midpoint");
  });
});
