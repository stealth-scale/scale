import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Opened, opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

function labelsIn(page: Opened): ReadonlyArray<null | string> {
  const field = within(panelOf(page)).getByRole("combobox", { name: "Page" });

  return within(field)
    .getAllByRole("option")
    .map(({ textContent }) => textContent);
}

describe("PageControls", () => {
  it("opens the route a person picks", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "Page" }), {
        target: { value: "/invoices" },
      });
    });

    expect(page.router.state.location.pathname).toBe("/invoices");
  });

  it("lists a route its sample fills", async () => {
    expect(labelsIn(await opened())).toContain("time-off/request");
  });

  it("lists the page's address first where no route's sample leads there", async () => {
    expect(labelsIn(await opened({}, "/time-off/8"))[0]).toBe("/time-off/8");
  });

  it("shows the address the page is at", async () => {
    const page = await opened();

    expect(
      within(panelOf(page)).getByRole<HTMLSelectElement>("combobox", { name: "Page" }).value,
    ).toBe("/time-off");
  });
});
