import { describe, expect, it } from "vitest";

import { drawAxes, faces } from "#draw/axes.ts";
import { FOUNDATION } from "#draw/foundation.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("axes", () => {
  it("draws the face tokens with the heading face following the body face", () => {
    expect(faces({ body: "Inter" })).toStrictEqual({
      body: { value: "Inter" },
      heading: { value: "Inter" },
    });
    expect(faces({ heading: "Fraunces", mono: "JetBrains Mono" })).toStrictEqual({
      heading: { value: "Fraunces" },
      mono: { value: "JetBrains Mono" },
    });
    expect(faces({})).toStrictEqual({});
  });

  it("draws nothing for an axis left out", () => {
    expect(drawAxes({})).toStrictEqual({ semanticTokens: {}, textStyles: {}, tokens: {} });
  });

  it("draws each axis into its category", () => {
    const drawn = drawAxes({
      colors: { ...FOUNDATION, hues: false },
      depth: { hue: 120 },
      faces: { mono: "Menlo" },
      metrics: { scale: 1 },
      shape: { corner: "1rem" },
      type: { base: 1 },
    });

    expect(Object.keys(drawn.semanticTokens).toSorted()).toStrictEqual([
      "borderWidths",
      "colors",
      "radii",
      "shadows",
      "sizes",
      "spacing",
    ]);
    expect(Object.keys(drawn.tokens).toSorted()).toStrictEqual(["fontSizes", "fonts"]);
    expect(tokenAt(drawn.textStyles, "md")).toMatchObject({ fontSize: "md" });
    expect(tokenAt(drawn.semanticTokens.radii, "l3")).toBe("1rem");
    expect(tokenAt(drawn.tokens.fonts, "mono")).toBe("Menlo");
  });

  it("draws the faces alone into the tokens where the type scale is left out", () => {
    expect(drawAxes({ faces: { body: "Inter" } }).tokens).toStrictEqual({
      fonts: { body: { value: "Inter" }, heading: { value: "Inter" } },
    });
  });
});
