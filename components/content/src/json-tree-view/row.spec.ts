import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, rowOf } from "#json-tree-view/json-tree-view.fixtures.tsx";

/**
 * Returns a fixed string. A value that contains it renders it as a branch without braces.
 */
function settle(): string {
  return "settled";
}

describe("Row", () => {
  it("renders a leaf's key and value", async () => {
    await drawn(composed());

    expect(rowOf("amount").textContent).toBe("amount: 4200");
  });

  it("renders the value's own row without a key", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("treeitem")[0]?.querySelector("[data-kind=key]")).toBeNull();
  });

  it("writes the key in quotes when quotesOnKeys is true", async () => {
    await drawn(composed({ quotesOnKeys: true }));

    expect(rowOf("amount").textContent).toBe('"amount": 4200');
  });

  it("marks the key of a property the value does not enumerate", async () => {
    await drawn(composed({ data: { settle }, defaultExpandedDepth: 2 }));

    expect(
      rowOf("[[Function]]").querySelector<HTMLElement>("[data-kind=key]")?.dataset["nonEnumerable"],
    ).toBe("");
  });

  it("leaves the attribute off an enumerable key", async () => {
    await drawn(composed());

    expect(rowOf("amount").querySelector("[data-non-enumerable]")).toBeNull();
  });

  it.each([
    { key: "tags", want: "]" },
    { key: "destination", want: "}" },
  ])("sets data-close on the $key row to $want", async ({ key, want }) => {
    await drawn(composed());

    expect(rowOf(key).dataset["close"]).toBe(want);
  });

  it("sets no data-close on a branch whose preview has no braces", async () => {
    await drawn(composed({ data: { settle } }));

    expect(rowOf("settle").dataset["close"]).toBeUndefined();
  });

  it("renders a leaf's row as a link to the address getHref returns", async () => {
    await drawn(
      composed(
        {},
        { getHref: (node) => (node.value === "cus_4Q2x" ? "#customers/cus_4Q2x" : undefined) },
      ),
    );

    expect(rowOf("customer").getAttribute("href")).toBe("#customers/cus_4Q2x");
  });

  it("renders a div for a leaf getHref returns nothing for", async () => {
    await drawn(composed({}, { getHref: () => {} }));

    expect(rowOf("amount").tagName).toBe("DIV");
  });

  it("renders what renderValue returns in the value's span", async () => {
    await drawn(
      composed({}, { renderValue: (node) => (node.value === 4200 ? "£42.00" : undefined) }),
    );

    expect(rowOf("amount").querySelector("[data-type=number]")?.textContent).toBe("£42.00");
  });

  it("renders the value when renderValue returns undefined", async () => {
    await drawn(composed({}, { renderValue: () => {} }));

    expect(rowOf("customer").textContent).toBe('customer: "cus_4Q2x"');
  });

  it("renders the arrow in a branch's indicator", async () => {
    await drawn(composed());

    expect(rowOf("tags").querySelector("[aria-hidden=true]")?.textContent).toBe("›");
  });
});
