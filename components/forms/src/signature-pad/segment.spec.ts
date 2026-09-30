import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, LINE, paths, stroked } from "#signature-pad/signature-pad.fixtures.tsx";

const STROKE = "M10,20 Q30,40 50,60 Z";

describe("Segment", () => {
  it("renders an svg hidden from assistive technology", async () => {
    const { container } = await drawn(composed());
    const segment = slotElement(container, "signature-pad", "segment");

    expect([segment.tagName.toLowerCase(), segment.getAttribute("aria-hidden")]).toStrictEqual([
      "svg",
      "true",
    ]);
  });

  it("renders a path per committed stroke", async () => {
    const { container } = await drawn(composed());

    await stroked(screen.getByRole("application"));
    await stroked(
      screen.getByRole("application"),
      LINE.map(([x, y]) => [x, y + 30]),
    );

    expect(paths(container)).toHaveLength(2);
  });

  it("renders the default strokes", async () => {
    const { container } = await drawn(composed({ defaultPaths: [STROKE, STROKE] }));

    expect(paths(container).map((path) => path.getAttribute("d"))).toStrictEqual([STROKE, STROKE]);
  });

  it("inks the strokes inline with the fill the caller passes in drawing", async () => {
    const { container } = await drawn(composed({ drawing: { fill: "navy" } }));

    expect(slotElement(container, "signature-pad", "segment").style.fill).toBe("navy");
  });

  it("sets no inline style without a fill", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "signature-pad", "segment").getAttribute("style")).toBeNull();
  });
});
