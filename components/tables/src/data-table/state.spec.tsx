import { type ReactElement } from "react";

import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { Root } from "#data-table/root.tsx";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the number of rows of the table the root provides.
 */
function Counted(): ReactElement {
  return <output>{useTableState().getRowModel().rows.length}</output>;
}

describe("useTableState", () => {
  it("throws a message naming DataTable outside a root", () => {
    expect(() => renderHook(() => useTableState())).toThrow(/DataTable/u);
  });

  it("returns the table the root provides", () => {
    render(
      <Root table={tableOf()}>
        <Counted />
      </Root>,
    );

    expect(screen.getByRole("status").textContent).toBe("12");
  });
});
