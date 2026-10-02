import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tabled } from "#data-table/data-table.fixtures.tsx";
import { boundsOf } from "#data-table/resizing.ts";

/**
 * Returns the separator that resizes the amount column.
 */
function separator(): HTMLElement {
  return screen.getByRole("separator", { name: "Resize Amount" });
}

/**
 * Presses a key on the amount column's separator and returns the column's size after it.
 */
function pressed(key: string): null | string {
  act(() => {
    fireEvent.keyDown(separator(), { key });
  });

  return separator().getAttribute("aria-valuenow");
}

describe("resizing", () => {
  it("returns TanStack's bounds for a column that states none", () => {
    expect(boundsOf({})).toStrictEqual({ max: Number.MAX_SAFE_INTEGER, min: 20 });
  });

  it("returns the bounds a column states", () => {
    expect(boundsOf({ maxSize: 400, minSize: 80 })).toStrictEqual({ max: 400, min: 80 });
  });

  it("narrows the column by 16px on ArrowLeft", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(pressed("ArrowLeft")).toBe("134");
  });

  it("widens the column on ArrowLeft under right-to-left", () => {
    render(tabled({ columnResizeDirection: "rtl", enableColumnResizing: true }));

    expect(pressed("ArrowLeft")).toBe("166");
  });

  it("narrows the column on ArrowRight under right-to-left", () => {
    render(tabled({ columnResizeDirection: "rtl", enableColumnResizing: true }));

    expect(pressed("ArrowRight")).toBe("134");
  });

  it("sets the column's minimum on Home", () => {
    render(tabled({ defaultColumn: { minSize: 60 }, enableColumnResizing: true }));

    expect(pressed("Home")).toBe("60");
  });

  it("sets the column's maximum on End", () => {
    render(tabled({ defaultColumn: { maxSize: 400 }, enableColumnResizing: true }));

    expect(pressed("End")).toBe("400");
  });

  it("resizes nothing on End for a column that states no maximum", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(fireEvent.keyDown(separator(), { key: "End" })).toBe(true);
  });

  it("keeps the size within the column's minimum", () => {
    render(tabled({ defaultColumn: { minSize: 140 }, enableColumnResizing: true }));

    expect(pressed("ArrowLeft")).toBe("140");
  });

  it("restores the size the column states on Enter", () => {
    render(tabled({ enableColumnResizing: true, initialState: { columnSizing: { amount: 300 } } }));

    expect(pressed("Enter")).toBe("150");
  });

  it("cancels the default of a key that resizes", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(fireEvent.keyDown(separator(), { key: "ArrowRight" })).toBe(false);
  });

  it("leaves the default of a key that does not resize", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(fireEvent.keyDown(separator(), { key: "Tab" })).toBe(true);
  });
});
