import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { filtered } from "#data-table/data-table.fixtures.tsx";

/**
 * Opens the filter whose button has the name given, and returns its panel.
 */
async function panelOf(name: string): Promise<HTMLElement> {
  fireEvent.click(screen.getByRole("button", { name }));
  await settled();

  return screen.getByRole("dialog", { name });
}

describe("FilterFields", () => {
  it("renders a text field for a text filter", async () => {
    await drawn(filtered());

    expect(within(await panelOf("Filter Account")).getAllByRole("textbox")).toHaveLength(1);
  });

  it("renders a box per value for a select filter", async () => {
    await drawn(filtered());

    expect(within(await panelOf("Filter Region")).getAllByRole("checkbox")).toHaveLength(2);
  });

  it("renders a field per end for a range filter", async () => {
    await drawn(filtered());

    expect(within(await panelOf("Filter Amount")).getAllByRole("spinbutton")).toHaveLength(2);
  });
});
