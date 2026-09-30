import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { fielded, paged } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the page size select.
 */
function select(): HTMLSelectElement {
  return screen.getByRole<HTMLSelectElement>("combobox", { name: "Entries per page" });
}

describe("PageSize", () => {
  it("shows the table's page size as its value", async () => {
    await drawn(paged());

    expect(select().value).toBe("5");
  });

  it("renders the indicator after the select hidden from assistive technology", async () => {
    await drawn(paged({}, null, "▾"));

    expect(select().nextElementSibling?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders no indicator when none is given", async () => {
    await drawn(paged());

    expect(select().nextElementSibling).toBeNull();
  });

  it("renders the label's words in a label that points at the select", async () => {
    await drawn(paged());
    const label = screen.getByText("Entries per page");

    expect([label.tagName, label.getAttribute("for")]).toStrictEqual(["LABEL", select().id]);
  });

  it("is named by the label of the field around it", async () => {
    await drawn(fielded());

    expect(select().value).toBe("5");
  });

  it("renders an option per size in the order given", async () => {
    await drawn(paged());

    expect([...select().options].map((option) => option.text)).toStrictEqual(["5", "10"]);
  });

  it("shows as many rows as the size chosen", async () => {
    await drawn(paged());
    act(() => {
      fireEvent.change(select(), { target: { value: "10" } });
    });

    expect(screen.getAllByRole("rowheader")).toHaveLength(10);
  });

  it("keeps the first row of the page in view after a change", async () => {
    await drawn(paged({ initialState: { pagination: { pageIndex: 2, pageSize: 5 } } }));
    act(() => {
      fireEvent.change(select(), { target: { value: "10" } });
    });

    expect(screen.getAllByRole("rowheader")[0]?.textContent).toBe("Account 11");
  });
});
