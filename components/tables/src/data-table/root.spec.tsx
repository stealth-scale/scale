import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";

import { tabled, tableOf } from "#data-table/data-table.fixtures.tsx";
import { Root } from "#data-table/root.tsx";

describe("Root", () => {
  it("returns no conformance violation for its DIV root", () => {
    expect(
      violations(Root, { as: true, children: true, element: "DIV", props: { table: tableOf() } }),
    ).toStrictEqual([]);
  });

  it("renders the recipe's root class", () => {
    const { container } = render(<Root table={tableOf()} />);

    expect(container.firstElementChild?.classList.contains("data-table__root")).toBe(true);
  });

  it("provides the table to the parts inside it", () => {
    render(tabled());

    expect(screen.getByRole("table", { name: "Ledger" })).toBeDefined();
  });
});
