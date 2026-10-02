import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotVariantClass } from "@stealthscale/testing-theme";

import { BRANCHED, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Class of a header whose rows stick.
 */
const STICKY = slotVariantClass("table", "header", "stickyHeader", true);

describe("Table", () => {
  it("returns no accessibility violation for a table of records", async () => {
    await expect(accessibilityViolations(() => tabled())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a table without rows", async () => {
    await expect(accessibilityViolations(() => tabled({ data: [] }))).resolves.toStrictEqual([]);
  });

  it("names the table by its caption", () => {
    render(tabled());

    expect(screen.getByRole("table", { name: "Ledger" })).toBeDefined();
  });

  it("points the scroll region's label at the caption", () => {
    const { container } = render(tabled());
    const caption = container.querySelector("caption");

    expect(container.querySelector(".table__viewport")?.getAttribute("aria-labelledby")).toBe(
      caption?.id,
    );
  });

  it("renders no caption and no region label without a caption", () => {
    const { container } = render(tabled({}, { caption: undefined }));

    expect([
      container.querySelector("caption"),
      container.querySelector(".table__viewport")?.getAttribute("aria-labelledby") ?? null,
    ]).toStrictEqual([null, null]);
  });

  it("renders No rows in a table without rows unless stated", () => {
    render(tabled({ data: [] }));

    expect(screen.getByRole("cell", { name: "No rows" })).toBeDefined();
  });

  it("passes the collections table's axes to its scroller", () => {
    const { container } = render(tabled({}, { variant: "surface" }));

    expect(container.querySelector(".table__scroller")?.className).toContain(
      "table__scroller--surface",
    );
  });

  it("writes the columns' sizes together as a table's size while its columns resize", () => {
    const { container } = render(tabled({ enableColumnResizing: true }));
    const sheet = container.querySelector<HTMLElement>("table");

    expect([sheet?.dataset["sized"], sheet?.style.getPropertyValue("--table-size")]).toStrictEqual([
      "",
      "450px",
    ]);
  });

  it("lays out a table with a pinned column in the fixed layout", () => {
    const { container } = render(
      tabled({ initialState: { columnPinning: { end: [], start: ["account"] } } }),
    );

    expect(container.querySelector("table")?.className).toContain("table__root--fixed");
  });

  it("keeps the fixed layout of a sized table over the caller's layout", () => {
    const { container } = render(tabled({ enableColumnResizing: true }, { layout: "auto" }));

    expect(container.querySelector("table")?.className).toContain("table__root--fixed");
  });

  it("renders a table without pins or resizing without a size", () => {
    const { container } = render(tabled());

    expect(container.querySelector<HTMLElement>("table")?.dataset["sized"]).toBeUndefined();
  });

  it("marks the scroller of a sized table data-sized", () => {
    const { container } = render(tabled({ enableColumnResizing: true }));

    expect(container.querySelector<HTMLElement>(".table__scroller")?.dataset["sized"]).toBe("");
  });

  it("adds the data table's frame class to the scroller", () => {
    const { container } = render(tabled());

    expect(container.querySelector(".table__scroller")?.className).toContain("data-table__frame");
  });

  it("lays out a windowed table at its columns' sizes", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(container.querySelector<HTMLElement>("table")?.dataset["sized"]).toBe("");
  });

  it("sticks the header of a windowed table", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(container.querySelector("thead")?.classList.contains(STICKY)).toBe(true);
  });

  it("keeps the header of a windowed table in place when stickyHeader is false", () => {
    const { container } = render(tabled({}, { stickyHeader: false, windowed: true }));

    expect(container.querySelector("thead")?.classList.contains(STICKY)).toBe(false);
  });

  it("sticks no header of a table that renders every row", () => {
    const { container } = render(tabled());

    expect(container.querySelector("thead")?.classList.contains(STICKY)).toBe(false);
  });

  it("keeps a grid's scroll region out of the tab order", () => {
    const { container } = render(tabled({}, { grid: true }));

    expect(container.querySelector(".table__viewport")?.getAttribute("tabindex")).toBe("-1");
  });

  it("keeps the scroll region of a table with levels out of the tab order", () => {
    const { container } = render(tabled(BRANCHED));

    expect(container.querySelector(".table__viewport")?.getAttribute("tabindex")).toBe("-1");
  });

  it("leaves the scroll region of a table without levels in the tab order while it overflows", () => {
    const { container } = render(tabled());

    expect(container.querySelector(".table__viewport")?.getAttribute("tabindex")).toBeNull();
  });

  it("keeps the focusable a grid's caller states over the grid's", () => {
    const { container } = render(tabled({}, { focusable: true, grid: true }));

    expect(container.querySelector(".table__viewport")?.getAttribute("tabindex")).toBeNull();
  });
});
