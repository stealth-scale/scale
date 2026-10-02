import { describe, expect, it } from "vitest";

import { drawn, scored, textsOf } from "#scatter-plot/scatter-plot.fixtures.tsx";

describe("tooltip", () => {
  it("names the tooltip by the point's series", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual(["Mid-market"]);
  });

  it("names each tooltip row by its axis' title", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__name")).toStrictEqual([
      "Deal size",
      "Days to close",
    ]);
  });

  it("writes each tooltip value with its axis' options", () => {
    const container = drawn({
      defaultIndex: 1,
      xOptions: { currency: "EUR", notation: "compact", style: "currency" },
    });

    expect(textsOf(container, ".chart__value")).toStrictEqual(["€18K", "22"]);
  });

  it("dashes the cross at the point the tooltip is at", () => {
    expect(
      drawn({ defaultIndex: 1 }).querySelector(".recharts-cross")?.getAttribute("stroke-dasharray"),
    ).toBe("3 3");
  });

  it("colors the tooltip's swatches in the point's series color", () => {
    const swatch = drawn({ defaultIndex: 1 }).querySelector<HTMLElement>(
      ".chart__row [data-value]",
    );

    expect(swatch?.dataset["value"]).toBe("var(--colors-series-1)");
  });

  it("heads the tooltip with the words of the point's label field", () => {
    expect(
      textsOf(scored({ defaultIndex: 0, quadrants: undefined }), ".chart__heading"),
    ).toStrictEqual(["Alder"]);
  });

  it("writes the point's quadrant after its words", () => {
    expect(textsOf(scored({ defaultIndex: 0 }), ".chart__heading")).toStrictEqual([
      "Alder, Leaders",
    ]);
  });
});
