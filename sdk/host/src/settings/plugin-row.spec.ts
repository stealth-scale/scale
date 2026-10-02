import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { settled } from "#settings/settings.fixtures.ts";

async function pressed(element: HTMLElement): Promise<void> {
  await act(async () => {
    fireEvent.click(element);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

function timeOffSwitch(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("switch", { name: /^Time off/u });
}

describe("PluginRow", () => {
  it("asks before switching off a plugin another plugin requires", async () => {
    await settled("/settings/host/plugins");
    await pressed(timeOffSwitch());

    expect(screen.getByText("Turn off Time off?")).toBeTruthy();
  });

  it("keeps the plugin switched on until the person confirms", async () => {
    const { host } = await settled("/settings/host/plugins");

    await pressed(timeOffSwitch());

    expect([timeOffSwitch().checked, internalsOf(host).switches.get()["time-off"]]).toStrictEqual([
      true,
      true,
    ]);
  });

  it("keeps the plugin on where the person keeps it", async () => {
    const { host } = await settled("/settings/host/plugins");

    await pressed(timeOffSwitch());
    await pressed(screen.getByRole("button", { name: "Keep on" }));

    expect(internalsOf(host).switches.get()["time-off"]).toBe(true);
  });

  it("switches the plugin off where the person confirms", async () => {
    const { host } = await settled("/settings/host/plugins");

    await pressed(timeOffSwitch());
    await pressed(screen.getByRole("button", { name: "Turn off" }));

    expect(internalsOf(host).switches.get()["time-off"]).toBe(false);
  });

  it("returns focus to the switch once the person settles", async () => {
    await settled("/settings/host/plugins");
    await pressed(timeOffSwitch());
    await pressed(screen.getByRole("button", { name: "Keep on" }));

    expect(document.activeElement).toBe(timeOffSwitch());
  });

  it("switches a plugin no other plugin requires without asking", async () => {
    const { host } = await settled("/settings/host/plugins");

    await pressed(screen.getByRole("switch", { name: /^Payroll/u }));

    expect(internalsOf(host).switches.get()["payroll"]).toBe(false);
  });

  it("states why a plugin is off while a plugin it needs is off", async () => {
    await settled("/settings/host/plugins");
    await pressed(timeOffSwitch());
    await pressed(screen.getByRole("button", { name: "Turn off" }));

    expect(
      screen.getByRole("switch", { name: /^Payroll/u }).closest("label")?.textContent,
    ).toContain("Off while a plugin it needs is off");
  });
});
