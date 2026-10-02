import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

describe("PluginControls", () => {
  it("switches the plugin off from its switch", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.click(within(panelOf(page)).getByRole("switch", { name: "Switched on" }));
    });

    expect(internalsOf(page.host).switches.get()["time-off"]).toBe(false);
  });

  it("stops the plugin by its kill switch", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.click(
        within(panelOf(page)).getByRole("switch", { name: "Allowed by its kill switch" }),
      );
    });

    expect(page.host.stores.flags.read("host/plugin.time-off")).toBe(false);
  });
});
