import { describe, expect, expectTypeOf, it } from "vitest";

import { type EventPayload } from "#command.ts";
import { type ChangeBatch } from "#data.ts";
import { hostContract, type Navigated, type PluginChanged } from "#host.ts";
import { type Session } from "#session.ts";

describe("hostContract", () => {
  it("declares under the reserved plugin id", () => {
    expect(hostContract.pluginId).toBe("host");
  });

  it("states no version", () => {
    expect(hostContract.version).toBeUndefined();
  });

  it("declares every region and structural slot", () => {
    expect(Object.keys(hostContract.slots)).toStrictEqual([
      "aside",
      "brand",
      "content",
      "footer",
      "header",
      "layout",
      "navigation",
      "overlay",
      "root",
      "status",
      "toolbar",
      "userMenu",
    ]);
  });

  it("renders one contribution in the brand region", () => {
    expect(hostContract.slots.brand).toStrictEqual({
      arity: "one",
      id: "host/brand",
      kind: "slot",
    });
  });

  it("renders one contribution in the user menu region", () => {
    expect(hostContract.slots.userMenu.arity).toBe("one");
  });

  it("declares the main menu", () => {
    expect(hostContract.menus.main).toStrictEqual({ id: "host/main", kind: "menu" });
  });

  it("declares the settings menu", () => {
    expect(hostContract.menus.settings).toStrictEqual({ id: "host/settings", kind: "menu" });
  });

  it("declares the settings route at settings", () => {
    expect(hostContract.routes.settings).toStrictEqual({
      id: "host/settings",
      kind: "route",
      path: "settings",
    });
  });

  it("declares the plugins settings page", () => {
    expect(hostContract.settings.pages.plugins).toStrictEqual({
      id: "host/plugins",
      kind: "settingsPage",
      label: "settings.plugins",
    });
  });

  it("declares the account settings page", () => {
    expect(hostContract.settings.pages.account.id).toBe("host/account");
  });

  it("keeps the last session for a late subscriber", () => {
    expect(hostContract.events.sessionChanged).toStrictEqual({
      id: "host/sessionChanged",
      kind: "event",
      sticky: true,
    });

    expectTypeOf<
      EventPayload<typeof hostContract.events.sessionChanged>
    >().toEqualTypeOf<Session>();
  });

  it("types the payload of a navigation", () => {
    expect(hostContract.events.navigated.kind).toBe("event");

    expectTypeOf<EventPayload<typeof hostContract.events.navigated>>().toEqualTypeOf<Navigated>();
  });

  it("types the payload of a plugin that turned on or off", () => {
    expect(hostContract.events.pluginChanged.kind).toBe("event");

    expectTypeOf<
      EventPayload<typeof hostContract.events.pluginChanged>
    >().toEqualTypeOf<PluginChanged>();
  });

  it("types the payload of changed records", () => {
    expect(hostContract.events.recordsChanged.kind).toBe("event");

    expectTypeOf<
      EventPayload<typeof hostContract.events.recordsChanged>
    >().toEqualTypeOf<ChangeBatch>();
  });
});
