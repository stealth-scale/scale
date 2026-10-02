import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { isPending } from "#host/host.fixtures.ts";
import { type Opened, opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

const CHECK = {
  permission: "time-off/request.approve",
  resource: { id: "7", type: "time-off/request" },
};

async function picked(page: Opened, name: string): Promise<void> {
  await settled(() => {
    fireEvent.click(within(panelOf(page)).getByRole("radio", { name }));
  });
}

describe("AccessControls", () => {
  it("denies every check after a press on Deny", async () => {
    const page = await opened();

    await picked(page, "Deny");

    await expect(page.sources.access.check([CHECK])).resolves.toStrictEqual([false]);
  });

  it("leaves every check pending after a press on Pending", async () => {
    const page = await opened();

    await picked(page, "Pending");

    await expect(isPending(page.sources.access.check([CHECK]))).resolves.toBe(true);
  });

  it("allows every check after a press on Allow", async () => {
    const page = await opened();

    await picked(page, "Deny");
    await picked(page, "Allow");

    await expect(page.sources.access.check([CHECK])).resolves.toStrictEqual([true]);
  });

  it("marks the decision a person picked", async () => {
    const page = await opened();

    await picked(page, "Deny");

    expect(
      within(panelOf(page)).getByRole<HTMLInputElement>("radio", { name: "Deny" }).checked,
    ).toBe(true);
  });
});
