import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { paged, searchField } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the name of the row header of each body row, in render order.
 */
function namesOf(): string[] {
  return screen.getAllByRole("rowheader").map((header) => header.textContent);
}

/**
 * Returns the page text's words.
 */
function pageText(): string | undefined {
  return document.querySelector(".pagination__page-text")?.textContent;
}

describe("Pagination", () => {
  it("renders the table's page as the current page", async () => {
    await drawn(paged({ initialState: { pagination: { pageIndex: 1, pageSize: 5 } } }));

    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("counts the pages from the table's rows and page size", async () => {
    await drawn(paged());

    expect(pageText()).toBe("1–5 of 12");
  });

  it("shows the rows of the page pressed", async () => {
    await drawn(paged());
    await pressed(screen.getByRole("button", { name: "Page 3" }));

    expect(namesOf()).toStrictEqual(["Account 11", "Account 12"]);
  });

  it("counts one page for a table that shows every row", async () => {
    await drawn(paged({ initialState: {} }));

    expect(pageText()).toBe("1–12 of 12");
  });

  it("counts the rows of a server from rowCount", async () => {
    await drawn(paged({ manualPagination: true, rowCount: 40 }));

    expect(pageText()).toBe("1–5 of 40");
  });

  it("counts no rows while the filters match none", async () => {
    await drawn(paged({ initialState: { globalFilter: "Nowhere" } }));

    expect(pageText()).toBe("0–0 of 0");
  });

  it("returns to the first page after a search", async () => {
    await drawn(
      paged({ initialState: { pagination: { pageIndex: 2, pageSize: 5 } } }, searchField()),
    );
    await act(async () => {
      fireEvent.change(screen.getByRole("searchbox"), { target: { value: "North" } });
      await Promise.resolve();
    });

    expect(pageText()).toBe("1–5 of 6");
  });
});
