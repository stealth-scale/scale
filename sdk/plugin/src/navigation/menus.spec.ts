import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { routed } from "#host/routed.fixtures.tsx";
import { MainMenu, SettingsMenu, TabsMenu } from "#navigation/navigation.fixtures.tsx";
import { linksOf } from "#navigation/pages.fixtures.ts";

describe("useNavigation", () => {
  it("lists the main menu's entries by rank then by label", async () => {
    const { view } = await routed(fixtureHost(), "/time-off", {}, MainMenu);

    expect(linksOf(view.container)).toStrictEqual([
      ["Invoices", "/invoices"],
      ["Time off", "/time-off"],
      ["Calendar", "/time-off/calendar"],
      ["Reports", "/reports"],
    ]);
  });

  it("lists the entries of the menu given", async () => {
    const { view } = await routed(fixtureHost(), "/time-off", {}, TabsMenu);

    expect(linksOf(view.container)).toStrictEqual([["History", "/time-off/history"]]);
  });

  it("leaves out an entry whose condition is false", async () => {
    const { view } = await routed(fixtureHost({ session: NOBODY }), "/time-off", {}, MainMenu);

    expect(linksOf(view.container)).toStrictEqual([
      ["Invoices", "/invoices"],
      ["Time off", "/time-off"],
      ["Calendar", "/time-off/calendar"],
    ]);
  });

  it("leaves out the entries of a plugin that turns off", async () => {
    const host = fixtureHost();
    const { view } = await routed(host, "/time-off", {}, MainMenu);

    act(() => {
      host.availability.set({ ...host.availability.get(), billing: { on: false, reason: "off" } });
    });

    expect(linksOf(view.container)).toStrictEqual([
      ["Time off", "/time-off"],
      ["Calendar", "/time-off/calendar"],
    ]);
  });

  it("lists the settings pages in the settings menu", async () => {
    const { view } = await routed(fixtureHost(), "/time-off", {}, SettingsMenu);

    expect(linksOf(view.container)).toStrictEqual([
      ["Plugins", "/settings/host/plugins"],
      ["Time off", "/settings/time-off/time-off"],
    ]);
  });

  it("keeps the host's settings pages in the settings menu while every plugin is off", async () => {
    const host = fixtureHost();
    const { view } = await routed(host, "/time-off", {}, SettingsMenu);

    act(() => {
      host.availability.set(
        Object.fromEntries(
          Object.keys(host.availability.get()).map((id) => [
            id,
            { on: false, reason: "off" as const },
          ]),
        ),
      );
    });

    expect(linksOf(view.container)).toStrictEqual([["Plugins", "/settings/host/plugins"]]);
  });
});
