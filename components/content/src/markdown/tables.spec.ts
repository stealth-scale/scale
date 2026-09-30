import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";

const TABLE = "| Store | Days | Owner |\n| :--- | ---: | :---: |\n| Mail | 30 | Ops |\n";

describe("renderTable", () => {
  it("renders the header row as column headers", () => {
    const { getAllByRole } = rendered(TABLE);

    expect(getAllByRole("columnheader").map((header) => header.textContent)).toStrictEqual([
      "Store",
      "Days",
      "Owner",
    ]);
  });

  it("renders a body row as cells", () => {
    const { getAllByRole } = rendered(TABLE);

    expect(getAllByRole("cell").map((cell) => cell.textContent)).toStrictEqual([
      "Mail",
      "30",
      "Ops",
    ]);
  });

  it("marks the cells of a right-aligned column as numeric", () => {
    const { getByRole } = rendered(TABLE);

    expect(getByRole("cell", { name: "30" }).dataset["numeric"]).toBe("");
  });

  it("marks the cells of a centred column as centred", () => {
    const { getByRole } = rendered(TABLE);

    expect(getByRole("cell", { name: "Ops" }).dataset["align"]).toBe("center");
  });

  it("leaves the cells of a left-aligned column unmarked", () => {
    const { getByRole } = rendered(TABLE);

    expect(Object.keys(getByRole("cell", { name: "Mail" }).dataset)).toStrictEqual([]);
  });

  it("names the scrolling region by the heading of its section", () => {
    const { container } = rendered(`## Subprocessors\n\n${TABLE}`);

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("aria-label")).toBe(
      "Subprocessors",
    );
  });

  it("names the scrolling region by tableLabel without a heading before it", () => {
    const { container } = rendered(TABLE, { tableLabel: "Tabel" });

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("aria-label")).toBe(
      "Tabel",
    );
  });
});
