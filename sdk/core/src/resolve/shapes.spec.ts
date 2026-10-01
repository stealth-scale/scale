import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { lazy, overview } from "#manifest.fixtures.ts";
import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { definitionWith, productOf, shapeFaults } from "#resolve/resolve.fixtures.ts";

describe("checkShapes", () => {
  it("takes a product its types state", () => {
    expect(
      shapeFaults(productOf([installed(timeOff, { config: { approvers: 2 } })])),
    ).toStrictEqual([]);
  });

  it("refuses a definition that is not an object", () => {
    expect(shapeFaults("people")).toStrictEqual(["product: must be an object"]);
  });

  it("refuses a member of the definition its type does not state", () => {
    expect(shapeFaults({ ...productOf([]), plugin: [] })).toStrictEqual([
      "product.plugin: is not a member the type states",
    ]);
  });

  it.each([
    { label: "a string", plugin: "time-off" },
    { label: "a manifest that is text", plugin: { manifest: "time-off" } },
    { label: "a manifest without a contract", plugin: { manifest: { code: {} } } },
    { label: "a contract without a plugin id", plugin: { manifest: { contract: {} } } },
  ])("refuses $label as an installed plugin", ({ plugin }) => {
    expect(shapeFaults(definitionWith(plugin))).toStrictEqual([
      "product.plugins.0: must be a plugin as installed returns it",
    ]);
  });

  it("refuses an option of an installed plugin under the plugin's id", () => {
    expect(shapeFaults(definitionWith({ ...installed(timeOff), enabeld: false }))).toStrictEqual([
      "product.plugins.time-off.enabeld: is not a member the type states",
    ]);
  });

  it("refuses a manifest's member under the plugin's id", () => {
    const manifest = { ...timeOff, apiVersion: "0.1", extra: true };

    expect(shapeFaults(definitionWith({ manifest }))).toStrictEqual([
      "time-off.extra: is not a member the type states",
      "time-off.apiVersion: must be a caret range such as ^1.4.0",
    ]);
  });

  it("refuses a route's code that imports no component", () => {
    const code = { ...timeOff.code, routes: { overview: lazy({ overview }), request: {} } };

    expect(shapeFaults(definitionWith({ manifest: { ...timeOff, code } }))).toStrictEqual([
      "time-off.code.routes.request.component: must be a function",
    ]);
  });

  it("refuses a migration keyed by anything but a version", () => {
    const settings = { reminders: { migrations: { 0: Object, first: Object } } };

    expect(
      shapeFaults(
        definitionWith({ manifest: { ...timeOff, code: { ...timeOff.code, settings } } }),
      ),
    ).toStrictEqual([
      "time-off.code.settings.reminders.migrations.0: must be keyed by a whole number of 1 or more",
      "time-off.code.settings.reminders.migrations.first: must be keyed by a whole number of 1 or more",
    ]);
  });

  it("refuses migrations that are not an object", () => {
    const settings = { reminders: { migrations: [Object] } };

    expect(
      shapeFaults(
        definitionWith({ manifest: { ...timeOff, code: { ...timeOff.code, settings } } }),
      ),
    ).toStrictEqual(["time-off.code.settings.reminders.migrations: must be an object"]);
  });

  it("refuses a reference whose id is not its name's", () => {
    const routes = { ...timeOffContract.routes, overview: timeOffContract.routes.request };
    const contract = { ...timeOffContract, routes };

    expect(shapeFaults(productOf([installed({ ...timeOff, contract })]))).toStrictEqual([
      'time-off.routes.overview.id: must be "time-off/overview"',
    ]);
  });

  it("refuses a contract's version and range that do not read", () => {
    const contract = {
      ...timeOffContract,
      requires: [{ pluginId: "identity", range: "1.x", version: "one" }],
      version: "four",
    };

    expect(shapeFaults(definitionWith({ manifest: { ...timeOff, contract } }))).toStrictEqual([
      "time-off.requires.0.range: must be a caret range such as ^1.4.0",
      "time-off.requires.0.version: must be a version such as 1.4.0",
      "time-off.version: must be a version such as 1.4.0",
    ]);
  });

  it("refuses a reference that is not an object", () => {
    const contract = { ...timeOffContract, menus: { reports: "time-off/reports" } };

    expect(shapeFaults(definitionWith({ manifest: { ...timeOff, contract } }))).toStrictEqual([
      "time-off.menus.reports: must be an object",
    ]);
  });

  it("refuses a kind's references that are not a record", () => {
    const contract = { ...timeOffContract, events: [] };

    expect(shapeFaults(definitionWith({ manifest: { ...timeOff, contract } }))).toStrictEqual([
      "time-off.events: must be an object",
    ]);
  });

  it("refuses the product's values of the wrong shape", () => {
    const definition = {
      ...productOf([]),
      featureFlags: [{ flag: "time-off/calendar", value: 1 }],
      signIn: { id: "identity/sign-in", kind: "slot" },
    };

    expect(shapeFaults(definition)).toStrictEqual([
      "product.featureFlags.0.value: must be a boolean or a string",
      "product.signIn: must be a reference to a route",
    ]);
  });
});
