import { describe, expect, it } from "vitest";

import {
  CLASS,
  COLUMN,
  PANEL_RAIL,
  PANEL_SIZE,
  RAIL,
  SCROLLER,
  SECTION,
  SETTLED,
  SHEET,
  STICKY_OFFSET,
  STICKY_TOP,
  WINDOW,
  WINDOW_HEIGHT,
} from "#app-shell/metrics.ts";

describe("metrics", () => {
  it("names the custom properties the recipe reads", () => {
    expect([PANEL_RAIL, PANEL_SIZE, STICKY_OFFSET, STICKY_TOP, WINDOW_HEIGHT]).toStrictEqual([
      "--app-shell-panel-rail",
      "--app-shell-panel-size",
      "--app-shell-sticky-offset",
      "--app-shell-sticky-top",
      "--app-shell-window-height",
    ]);
  });

  it("names the class and the attribute the recipe selects on", () => {
    expect([CLASS, SETTLED]).toStrictEqual(["app-shell", "data-settled"]);
  });

  it("reads the window height with the dynamic viewport height as the fallback", () => {
    expect(WINDOW).toBe("var(--app-shell-window-height, 100dvh)");
  });

  it("keeps a sheet a rail's width short of the far edge", () => {
    expect(SHEET).toBe("min(var(--app-shell-panel-size), calc(100% - {sizes.rail}))");
  });

  it("grows a section with data-grows", () => {
    expect(SECTION["&[data-grows]"]).toStrictEqual({ flex: "1" });
  });

  it("grows the root of a section that scrolls with data-grows", () => {
    expect(SCROLLER["&[data-grows]"]).toStrictEqual({ flex: "1" });
  });

  it("lets the root of a section that scrolls shrink below its content", () => {
    expect(SCROLLER.minBlockSize).toBe("0");
  });

  it("makes a region's column at least as tall as its viewport", () => {
    expect(COLUMN.minBlockSize).toBe("100%");
  });

  it("gives a sidebar in a column the column's height", () => {
    expect(COLUMN["& > .sidebar__root"]).toStrictEqual({ flex: "1 1 0", minBlockSize: "0" });
  });

  it("pads a section by the large gap", () => {
    expect(SECTION.padding).toBe("calc({spacing.gap.lg} * var(--density, 1))");
  });

  it("centres the rail's 24px strip on the edge", () => {
    expect(RAIL).toMatchObject({
      inlineSize: "6",
      marginInline: "calc({sizes.6} / -2)",
      position: "relative",
    });
  });

  it("hides the rail under a coarse pointer", () => {
    expect(RAIL).toMatchObject({ _touch: { display: "none" } });
  });

  it("shows the rail's line under the pointer", () => {
    expect(RAIL).toMatchObject({ _hover: { _after: { background: "border.emphasized" } } });
  });
});
