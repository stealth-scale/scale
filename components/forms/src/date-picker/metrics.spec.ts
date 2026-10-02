import { describe, expect, it } from "vitest";

import { cellSide, cellStates, CLEARED, LAST, wideCell } from "#date-picker/metrics.ts";

describe("metrics", () => {
  it("sizes a day's cell from the size scale", () => {
    expect(cellSide("md")).toBe("max({sizes.6}, calc({sizes.9} * var(--density, 1)))");
  });

  it("keeps a small day's cell at least 24px at any density", () => {
    expect(cellSide("sm")).toBe("max({sizes.6}, calc({sizes.8} * var(--density, 1)))");
  });

  it("widens a month's cell to 1.75 days", () => {
    expect(wideCell("lg")).toBe(
      "calc(max({sizes.6}, calc({sizes.10} * var(--density, 1))) * 1.75)",
    );
  });

  it("fills a selected cell with the palette's solid", () => {
    expect(cellStates()["&[data-selected]"]).toMatchObject({
      background: "colorPalette.solid",
      color: "colorPalette.contrast",
    });
  });

  it("fills a selected cell with Highlight under forced colors", () => {
    expect(cellStates()["&[data-selected]"]).toMatchObject({
      _highContrast: { background: "Highlight", color: "HighlightText" },
    });
  });

  it("writes the selected look after the range's", () => {
    const states = Object.keys(cellStates());

    expect(states.indexOf("&[data-selected]")).toBeGreaterThan(
      states.indexOf("&[data-in-range], &[data-in-hover-range]"),
    );
  });

  it("writes the radii of a range's ends after the range's square corners", () => {
    const states = Object.keys(cellStates());

    expect(
      Math.min(states.indexOf("&[data-range-start]"), states.indexOf("&[data-range-end]")),
    ).toBeGreaterThan(states.indexOf("&[data-in-range], &[data-in-hover-range]"));
  });

  it("fills a range's middle with Highlight under forced colors", () => {
    expect(cellStates()["&[data-in-range], &[data-in-hover-range]"]).toMatchObject({
      _highContrast: { background: "Highlight", color: "HighlightText" },
    });
  });

  it("restates the forced fill of a range's middle under a pointer", () => {
    expect(cellStates()["&[data-in-range], &[data-in-hover-range]"]).toMatchObject({
      _hover: {
        "&[data-in-range], &[data-in-hover-range]": {
          _highContrast: { background: "Highlight", color: "HighlightText" },
        },
      },
    });
  });

  it("restates the forced fill of a selected cell under a pointer", () => {
    expect(cellStates()["&[data-selected]"]).toMatchObject({
      _hover: {
        "&[data-selected]": { _highContrast: { background: "Highlight", color: "HighlightText" } },
      },
    });
  });

  it("hides a day outside the month unless a person can select it", () => {
    expect(cellStates()["&[data-outside-range]:not([data-selectable])"]).toStrictEqual({
      visibility: "hidden",
    });
  });

  it("rounds only the outer corners of a range's start", () => {
    expect(cellStates()["&[data-range-start]"]).toStrictEqual({
      borderEndStartRadius: "l2",
      borderStartStartRadius: "l2",
    });
  });

  it("rounds only the outer corners of a range's end", () => {
    expect(cellStates()["&[data-range-end]"]).toStrictEqual({
      borderEndEndRadius: "l2",
      borderStartEndRadius: "l2",
    });
  });

  it("selects the last input of a control while its clear trigger shows", () => {
    expect(CLEARED).toBe(
      ".date-picker__control:has(> .date-picker__clearTrigger:not([hidden])) > &:last-of-type",
    );
  });

  it("selects the last input of a control", () => {
    expect(LAST).toBe("&:last-of-type");
  });
});
