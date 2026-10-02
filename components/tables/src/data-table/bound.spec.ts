import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { filtered, managed, SELECTING, tabled } from "#data-table/data-table.fixtures.tsx";

describe("bound", () => {
  it("adds the data table's cell class to a data cell", () => {
    render(tabled());

    expect(screen.getByRole("cell", { name: "700" }).className).toContain("data-table__cell");
  });

  it("keeps the collections table's cell class on a data cell", () => {
    render(tabled());

    expect(screen.getByRole("cell", { name: "700" }).className).toContain("table__cell");
  });

  it("adds the data table's row header class to a row header", () => {
    render(tabled());

    expect(screen.getByRole("rowheader", { name: "Account 01" }).className).toContain(
      "data-table__row-header",
    );
  });

  it("adds the data table's column header class to a column header", () => {
    render(tabled());

    expect(screen.getByRole("columnheader", { name: "Region" }).className).toContain(
      "data-table__column-header",
    );
  });

  it("adds the data table's row class to a body row", () => {
    render(tabled());

    expect(screen.getByRole("row", { name: /Account 01/u }).className).toContain("data-table__row");
  });

  it("adds the data table's table class to the table", () => {
    render(tabled());

    expect(screen.getByRole("table").className).toContain("data-table__table");
  });

  it("keeps the collections table's scroller class on the frame", () => {
    const { container } = render(tabled());

    expect(container.querySelector(".data-table__frame")?.className).toContain("table__scroller");
  });

  it("adds the data table's count class to a group's number of records", () => {
    const { container } = render(tabled({ initialState: { grouping: ["region"] } }));

    expect(container.querySelector(".data-table__count")?.textContent).toBe("(6)");
  });

  it("adds the data table's expand indicator class to a toggle's glyph", () => {
    const { container } = render(
      tabled({ initialState: { grouping: ["region"] } }, { expandIndicator: "›" }),
    );

    expect(container.querySelector(".data-table__expand-indicator")?.textContent).toBe("›");
  });

  it("adds the data table's toggle class to the box around a row's button", () => {
    const { container } = render(tabled({ initialState: { grouping: ["region"] } }));

    expect(container.querySelector("tbody button")?.parentElement?.className).toContain(
      "data-table__toggle",
    );
  });

  it("adds the data table's select box class to the box around a row's checkbox", async () => {
    const { container } = await drawn(tabled({ columns: SELECTING }));

    expect(container.querySelector("tbody label")?.parentElement?.className).toContain(
      "data-table__select-box",
    );
  });

  it("adds the data table's spacer class to a windowed table's spacer row", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(container.querySelector("tr[aria-hidden]")?.className).toContain("data-table__spacer");
  });

  it("adds the data table's region class to a group of pinned rows", () => {
    const { container } = render(
      tabled(
        { initialState: { rowPinning: { bottom: [], top: ["Account 05"] } } },
        { windowed: true },
      ),
    );

    expect(container.querySelector("tbody[data-pinned=top]")?.className).toContain(
      "data-table__region",
    );
  });

  it("adds the data table's panel class to a filter's panel", async () => {
    await drawn(filtered());
    fireEvent.click(screen.getByRole("button", { name: "Filter Region" }));
    await settled();

    expect(screen.getByRole("dialog", { name: "Filter Region" }).className).toContain(
      "data-table__panel",
    );
  });

  it("adds the data table's value class to a value filter's box", async () => {
    await drawn(filtered());
    fireEvent.click(screen.getByRole("button", { name: "Filter Region" }));
    await settled();

    expect(screen.getByRole("checkbox", { name: "North 6" }).closest("label")?.className).toContain(
      "data-table__value",
    );
  });

  it("adds the data table's value label class to a value's label", async () => {
    await drawn(filtered());
    fireEvent.click(screen.getByRole("button", { name: "Filter Region" }));
    await settled();

    expect(document.querySelector(".data-table__value-label")?.textContent).toBe("North 6");
  });

  it("adds the data table's reset class to the actions button", async () => {
    await drawn(managed());

    const { classList } = screen.getByRole("button", { name: "Reset" });

    expect([classList.contains("button"), classList.contains("data-table__reset")]).toStrictEqual([
      true,
      true,
    ]);
  });
});
