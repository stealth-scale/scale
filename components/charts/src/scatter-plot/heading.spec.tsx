import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type TooltipEntry } from "#chart/tooltip.tsx";
import { headingOf, type HeadingOptions } from "#scatter-plot/heading.tsx";
import { NAMES, VENDORS } from "#scatter-plot/scatter-plot.fixtures.tsx";

/**
 * Lists the options of a heading without a label field or quadrants.
 */
const PLAIN: HeadingOptions = {
  locale: "en-US",
  seriesOf: () => "Vendors",
  xKey: "vision",
  yKey: "execution",
};

/**
 * Lists the quadrants of the vendors, divided at the middle of 0 to 1.
 */
const QUADRANTS = { division: { x: 0.5, y: 0.5 }, names: NAMES };

/**
 * Returns the text of the heading the options write for the entries.
 */
function textOf(options: HeadingOptions, entries: readonly TooltipEntry[]): string {
  return render(<>{headingOf(options)(entries)}</>).container.textContent;
}

describe("headingOf", () => {
  it("heads a point by its series without a label field", () => {
    expect(textOf(PLAIN, [{ payload: VENDORS[0] }])).toBe("Vendors");
  });

  it("heads a point by the words of its label field", () => {
    expect(textOf({ ...PLAIN, labelKey: "name" }, [{ payload: VENDORS[0] }])).toBe("Alder");
  });

  it("heads a point by the number in its label field", () => {
    expect(textOf({ ...PLAIN, labelKey: "rank" }, [{ payload: { rank: 7 } }])).toBe("7");
  });

  it("heads a point by its series where its label field contains no words", () => {
    expect(textOf({ ...PLAIN, labelKey: "name" }, [{ payload: { vision: 0.5 } }])).toBe("Vendors");
  });

  it("heads an entry without a point by its series", () => {
    expect(textOf({ ...PLAIN, labelKey: "name" }, [{ payload: null }])).toBe("Vendors");
  });

  it("writes the point's quadrant after its words", () => {
    expect(
      textOf({ ...PLAIN, labelKey: "name", quadrants: QUADRANTS }, [{ payload: VENDORS[3] }]),
    ).toBe("Maple, Visionaries");
  });

  it("joins the words and the quadrant with the locale's list separator", () => {
    expect(
      textOf({ ...PLAIN, labelKey: "name", locale: "ja-JP", quadrants: QUADRANTS }, [
        { payload: VENDORS[1] },
      ]),
    ).toBe("Birch、Challengers");
  });
});
