import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the separator that resizes the column named.
 */
function separatorOf(column: string): HTMLElement {
  return screen.getByRole("separator", { name: `Resize ${column}` });
}

describe("Resizer", () => {
  it("renders an hr for each resizable column", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(separatorOf("Amount").tagName).toBe("HR");
  });

  it("renders no separator while the table does not resize", () => {
    render(tabled());

    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("puts the separator in the tab order", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(separatorOf("Amount").tabIndex).toBe(0);
  });

  it("states a vertical orientation", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(separatorOf("Amount").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("states the column's size as its value", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(separatorOf("Amount").getAttribute("aria-valuenow")).toBe("150");
  });

  it("states the column's size in words", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(separatorOf("Amount").getAttribute("aria-valuetext")).toBe("150 pixels");
  });

  it("states TanStack's bounds for a column that states none", () => {
    render(tabled({ enableColumnResizing: true }));
    const separator = separatorOf("Amount");

    expect([
      separator.getAttribute("aria-valuemin"),
      separator.getAttribute("aria-valuemax"),
    ]).toStrictEqual(["20", String(Number.MAX_SAFE_INTEGER)]);
  });

  it("names the separator in the table's words", () => {
    render(
      tabled({ enableColumnResizing: true }, { resizeLabel: (column) => `Width of ${column}` }),
    );

    expect(screen.getByRole("separator", { name: "Width of Amount" })).toBeDefined();
  });

  it("widens the column by 16px on ArrowRight", () => {
    render(tabled({ enableColumnResizing: true }));
    act(() => {
      fireEvent.keyDown(separatorOf("Amount"), { key: "ArrowRight" });
    });

    expect(separatorOf("Amount").getAttribute("aria-valuenow")).toBe("166");
  });

  it("restores the column's size on a double click", () => {
    render(tabled({ enableColumnResizing: true, initialState: { columnSizing: { amount: 240 } } }));
    act(() => {
      fireEvent.doubleClick(separatorOf("Amount"));
    });

    expect(separatorOf("Amount").getAttribute("aria-valuenow")).toBe("150");
  });

  it("resizes the column by a pointer drag", () => {
    render(tabled({ enableColumnResizing: true }));
    act(() => {
      fireEvent.mouseDown(separatorOf("Amount"), { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 140 });
      fireEvent.mouseUp(document, { clientX: 140 });
    });

    expect(separatorOf("Amount").getAttribute("aria-valuenow")).toBe("190");
  });

  it("narrows the column by a pointer drag to the right under right-to-left", () => {
    render(tabled({ columnResizeDirection: "rtl", enableColumnResizing: true }));
    act(() => {
      fireEvent.mouseDown(separatorOf("Amount"), { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 140 });
      fireEvent.mouseUp(document, { clientX: 140 });
    });

    expect(separatorOf("Amount").getAttribute("aria-valuenow")).toBe("110");
  });

  it("marks the separator while a pointer resizes its column", () => {
    render(tabled({ enableColumnResizing: true }));
    act(() => {
      fireEvent.mouseDown(separatorOf("Amount"), { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 120 });
    });

    expect(separatorOf("Amount").dataset["resizing"]).toBe("");
  });
});
