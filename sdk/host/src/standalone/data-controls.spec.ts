import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { REQUEST } from "#host/product.fixtures.ts";
import { opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

describe("DataControls", () => {
  it("sets the mode a person picks for an operation", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "time-off/request" }), {
        target: { value: "forbidden" },
      });
    });

    expect(page.modes.get()).toStrictEqual({ [REQUEST.id]: "forbidden" });
  });

  it("loads the page's queries again from nothing after a pick for a query", async () => {
    const page = await opened();
    const reset = vi.spyOn(page.host.data, "resetQueries");

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "time-off/request" }), {
        target: { value: "delayed" },
      });
    });

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("loads the page again after a pick for a query", async () => {
    const page = await opened();
    const invalidated = vi.spyOn(page.router, "invalidate");

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "time-off/request" }), {
        target: { value: "sample" },
      });
    });

    expect(invalidated).toHaveBeenCalledTimes(1);
  });

  it("keeps the page's data after a pick for a mutation", async () => {
    const page = await opened();
    const reset = vi.spyOn(page.host.data, "resetQueries");

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "time-off/approve" }), {
        target: { value: "delayed" },
      });
    });

    expect(reset).not.toHaveBeenCalled();
  });

  it("offers every mode in order", async () => {
    const page = await opened();
    const field = within(panelOf(page)).getByRole("combobox", { name: "time-off/request" });

    expect(
      within(field)
        .getAllByRole("option")
        .map(({ textContent }) => textContent),
    ).toStrictEqual([
      "Sample",
      "Sample after 2 seconds",
      "Refuse as a conflict",
      "Refuse as forbidden",
      "Refuse as invalid",
      "Fail on the network",
      "Refuse as not found",
      "Fail on the server",
      "Refuse as signed out",
    ]);
  });
});
