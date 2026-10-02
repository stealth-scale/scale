import { act, fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { settled } from "#settings/settings.fixtures.ts";

describe("PluginList", () => {
  it("lists every installed plugin in install order", async () => {
    await settled("/settings/host/plugins");

    const list = within(screen.getByRole("region", { name: "Installed plugins" })).getByRole(
      "list",
    );

    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
  });

  it("switches a plugin off for the person", async () => {
    const { host } = await settled("/settings/host/plugins");

    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: /^Profile/u }));
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 20);
      });
    });

    expect(internalsOf(host).switches.get()["profile"]).toBe(false);
  });

  it("renders a locked plugin's switch on", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole<HTMLInputElement>("switch", { name: /^Billing/u }).checked).toBe(true);
  });

  it("renders a locked plugin's switch disabled", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole<HTMLInputElement>("switch", { name: /^Billing/u }).disabled).toBe(true);
  });

  it("states that a locked plugin is always on", async () => {
    await settled("/settings/host/plugins");

    expect(
      screen.getByRole("switch", { name: /^Billing/u }).closest("label")?.textContent,
    ).toContain("Always on");
  });
});
