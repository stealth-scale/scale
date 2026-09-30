import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FOOTED, HEADED_UNFOOTED, tabled } from "#data-table/data-table.fixtures.tsx";

describe("Footer", () => {
  it("renders no footer while no column states one", () => {
    const { container } = render(tabled());

    expect(container.querySelector("tfoot")).toBeNull();
  });

  it("renders a row-header column's footer as a row header", () => {
    render(tabled({ columns: FOOTED }));

    expect(screen.getByRole("rowheader", { name: "Total" }).closest("tfoot")).not.toBeNull();
  });

  it("marks a numeric column's footer data-numeric", () => {
    render(tabled({ columns: FOOTED }));

    expect(screen.getByRole("cell", { name: "6,600" }).dataset["numeric"]).toBe("true");
  });

  it("marks a pinned column's footer with its region", () => {
    render(
      tabled({ columns: FOOTED, initialState: { columnPinning: { end: ["amount"], start: [] } } }),
    );

    expect(screen.getByRole("cell", { name: "6,600" }).dataset["pinned"]).toBe("end");
  });

  it("renders no footer cell of a hidden column", () => {
    const { container } = render(
      tabled({ columns: FOOTED, initialState: { columnVisibility: { region: false } } }),
    );

    expect(container.querySelectorAll("tfoot tr > *")).toHaveLength(2);
  });

  it("renders an empty cell for a column without a footer", () => {
    const { container } = render(tabled({ columns: FOOTED }));

    expect(container.querySelectorAll("tfoot td")).toHaveLength(2);
  });

  it("renders a data cell for a row-header column without a footer", () => {
    const { container } = render(tabled({ columns: HEADED_UNFOOTED }));

    expect(
      [...container.querySelectorAll("tfoot tr > *")].map((cell) => cell.tagName),
    ).toStrictEqual(["TH", "TD", "TD"]);
  });

  it("states the row's aria-rowindex in a windowed table", () => {
    const { container } = render(tabled({ columns: FOOTED }, { windowed: true }));

    expect(container.querySelector("tfoot tr")?.getAttribute("aria-rowindex")).toBe("14");
  });

  it("states no aria-rowindex on the row of a table that renders every row", () => {
    const { container } = render(tabled({ columns: FOOTED }));

    expect(container.querySelector("tfoot tr")?.hasAttribute("aria-rowindex")).toBe(false);
  });
});
