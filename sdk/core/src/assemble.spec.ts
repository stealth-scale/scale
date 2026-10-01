import { describe, expect, it } from "vitest";

import { assemble } from "#assemble.ts";
import { HOST } from "#identifiers.ts";
import { route } from "#route.ts";
import { settingsPage, settingsSection } from "#settings.ts";
import { slot } from "#slot.ts";
import { needs } from "#version.ts";

describe("assemble", () => {
  it("builds a contract from a definition written as an object", () => {
    const contract = assemble("inventory", { routes: { list: route({ path: "inventory" }) } });

    expect(contract.routes.list).toStrictEqual({
      id: "inventory/list",
      kind: "route",
      path: "inventory",
    });
  });

  it("builds an empty record for every kind the definition lists none of", () => {
    const contract = assemble("inventory", {});

    expect(contract.commands).toStrictEqual({});
    expect(contract.menus).toStrictEqual({});
    expect(contract.settings).toStrictEqual({ pages: {}, sections: {} });
  });

  it("leaves the version out of every reference where the definition states none", () => {
    const contract = assemble("inventory", { menus: ["stock"] });

    expect(contract.menus.stock).toStrictEqual({ id: "inventory/stock", kind: "menu" });
    expect(contract.version).toBeUndefined();
  });

  it("leaves the configuration undefined where the definition states none", () => {
    expect(assemble("inventory", {}).config).toBeUndefined();
  });

  it("keeps the requirements the definition states", () => {
    const identity = assemble("identity", { version: "0.4.2" });
    const contract = assemble("inventory", { requires: [needs(identity, "^0.4.0")] });

    expect(contract.requires).toStrictEqual([
      { pluginId: "identity", range: "^0.4.0", version: "0.4.2" },
    ]);
  });

  it("takes the host's plugin id", () => {
    expect(assemble(HOST, {}).pluginId).toBe("host");
  });

  it("returns a reference from self for a declared name", () => {
    const contract = assemble("inventory", (self) => ({
      routes: {
        item: route({ parent: self.route("list"), path: "item" }),
        list: route({ path: "inventory" }),
      },
    }));

    expect(contract.routes.item.parent).toStrictEqual({ id: "inventory/list", kind: "route" });
  });

  it("throws where self names a name the definition does not declare", () => {
    expect(() =>
      assemble("time-off", (self) => ({
        routes: { request: route({ parent: self.route("detial"), path: "request" }) },
      })),
    ).toThrow(
      'The contract time-off references its own route "detial", which it does not declare.',
    );
  });

  it("names the kind of an undeclared settings page in words", () => {
    expect(() =>
      assemble("time-off", (self) => ({
        settings: {
          sections: {
            reminders: settingsSection({ label: "x", target: self.settingsPage("account") }),
          },
        },
      })),
    ).toThrow(
      'The contract time-off references its own settings page "account", which it does not declare.',
    );
  });

  it("throws for a plugin id that breaks its grammar", () => {
    expect(() => assemble("Time_Off", {})).toThrow(
      'The plugin id "Time_Off" breaks the grammar of a plugin id: 2 to 32 characters of ' +
        "lowercase words joined by hyphens.",
    );
  });

  it("throws for a route name that breaks its grammar", () => {
    expect(() => assemble("time-off", { routes: { "Over view": route({ path: "x" }) } })).toThrow(
      'The contract time-off declares the route "Over view", which breaks the grammar of a name.',
    );
  });

  it("throws for a menu name that breaks its grammar", () => {
    expect(() => assemble("time-off", { menus: ["Reports"] })).toThrow(
      'The contract time-off declares the menu "Reports", which breaks the grammar of a name.',
    );
  });

  it("throws for a settings page name that breaks its grammar", () => {
    expect(() =>
      assemble("time-off", { settings: { pages: { "time off": settingsPage({ label: "x" }) } } }),
    ).toThrow(
      'The contract time-off declares the settings page "time off", which breaks the grammar of a name.',
    );
  });

  it("throws for a slot name that breaks its grammar", () => {
    expect(() => assemble("time-off", { slots: { side_bar: slot() } })).toThrow(
      'The contract time-off declares the slot "side_bar", which breaks the grammar of a name.',
    );
  });
});
