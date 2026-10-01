import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { routed } from "#host/routed.fixtures.tsx";
import { MainMenu, TabsMenu } from "#navigation/navigation.fixtures.tsx";
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
});
