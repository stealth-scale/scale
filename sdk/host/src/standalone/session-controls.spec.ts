import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Opened, opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

async function pressed(page: Opened, name: string): Promise<void> {
  await settled(() => {
    fireEvent.click(within(panelOf(page)).getByRole("switch", { name }));
  });
}

describe("SessionControls", () => {
  it("signs the session out from its switch", async () => {
    const page = await opened();

    await pressed(page, "Signed in");

    expect(page.sources.session.read().authenticated).toBe(false);
  });

  it("takes a permission out of the session from its switch", async () => {
    const page = await opened();

    await pressed(page, "time-off/request.approve");

    expect(page.sources.session.read().permissions).not.toContain("time-off/request.approve");
  });

  it("puts a permission back into the session from its switch", async () => {
    const page = await opened();

    await pressed(page, "time-off/request.approve");
    await pressed(page, "time-off/request.approve");

    expect(page.sources.session.read().permissions).toContain("time-off/request.approve");
  });

  it("takes an entitlement out of the session from its switch", async () => {
    const page = await opened();

    await pressed(page, "time-off/module");

    expect(page.sources.session.read().entitlements).toStrictEqual([]);
  });
});
