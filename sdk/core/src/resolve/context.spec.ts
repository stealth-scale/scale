import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { hostContract } from "#host.ts";
import { plain, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { conditionsIn, isInstalled, keyOf, listed, pathOf } from "#resolve/context.ts";
import { claiming } from "#resolve/identity.fixtures.ts";
import { contextFor, productOf } from "#resolve/resolve.fixtures.ts";

describe("context", () => {
  it("lists a contract's references kind by kind", () => {
    const kinds = listed(timeOffContract).map(({ kind, name }) => `${kind}:${name}`);

    expect([kinds.at(0), kinds.at(-1), kinds.length]).toStrictEqual([
      "command:approve",
      "slot:request-sidebar",
      19,
    ]);
  });

  it("keys a reference by its kind and its qualified id", () => {
    expect(keyOf(timeOffContract.routes.overview)).toBe("route:time-off/overview");
  });

  it.each([
    { pluginId: "host", want: true },
    { pluginId: "time-off", want: true },
    { pluginId: "identity", want: false },
  ])("returns $want for installing $pluginId", ({ pluginId, want }) => {
    expect(isInstalled(contextFor(productOf([installed(timeOff)])), pluginId)).toBe(want);
  });

  it("dots a declared name's path through its kind's member", () => {
    const context = contextFor(productOf([installed(timeOff)]));
    const section = context.declared.get("settingsSection:time-off/reminders");

    expect(section === undefined ? undefined : pathOf(section)).toBe(
      "time-off.settings.sections.reminders",
    );
  });

  it("lists every nested condition with its path", () => {
    const when = { allOf: [{ authenticated: true }], anyOf: [{ not: { authenticated: false } }] };

    expect(conditionsIn(when, "at").map(({ path }) => path)).toStrictEqual([
      "at",
      "at.allOf.0",
      "at.anyOf.0",
      "at.anyOf.0.not",
    ]);
  });

  it("lists no condition where none is stated", () => {
    expect(conditionsIn(undefined, "at")).toStrictEqual([]);
  });

  it("declares the host's names first with no code", () => {
    const context = contextFor(productOf([installed(timeOff)]));
    const [first] = context.declared.values();

    expect([first?.plugin, first?.code, first?.contract]).toStrictEqual(["host", {}, hostContract]);
  });

  it("keeps the host's declaration of a name a plugin claiming its id declares", () => {
    const context = contextFor(productOf([installed(claiming)]));

    expect(context.declared.get("slot:host/aside")?.reference).toBe(hostContract.slots.aside);
  });

  it("keeps the first installation of a plugin installed twice", () => {
    const context = contextFor(productOf([installed(plain), installed(plain, { locked: true })]));

    expect([context.installations.length, context.installed.get("plain")?.options]).toStrictEqual([
      2,
      {},
    ]);
  });
});
