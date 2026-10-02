import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeElement, variantClass } from "@stealthscale/testing-theme";

import { ColorSwatchMix } from "#color-swatch/mix.tsx";

describe("ColorSwatchMix", () => {
  it.each([
    [2, "halves"],
    [3, "thirds"],
    [4, "quarters"],
  ] as const)("applies the mix class for %i colours", (count, division) => {
    const items = ["#000000", "#111111", "#222222", "#333333"].slice(0, count) as unknown as [
      string,
      string,
    ];
    const { container } = render(<ColorSwatchMix items={items} />);

    expect(recipeElement(container, "color-swatch").className).toContain(
      variantClass("color-swatch", "mix", division),
    );
  });

  it("sets one numbered custom property per colour", () => {
    const { container } = render(<ColorSwatchMix items={["#000000", "#111111", "#222222"]} />);
    const { style } = recipeElement(container, "color-swatch");

    expect(
      [1, 2, 3].map((at) => style.getPropertyValue(`--color-swatch-${String(at)}`)),
    ).toStrictEqual(["#000000", "#111111", "#222222"]);
  });

  it("keeps a style the caller passes beside the colours", () => {
    const { container } = render(
      <ColorSwatchMix items={["#000000", "#111111"]} style={{ opacity: 0.5 }} />,
    );

    expect(recipeElement(container, "color-swatch").style.opacity).toBe("0.5");
  });
});
