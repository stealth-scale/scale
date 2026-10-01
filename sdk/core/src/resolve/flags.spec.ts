import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { faulty, switches } from "#resolve/flags.fixtures.ts";
import { resolveFlags } from "#resolve/flags.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("flags", () => {
  it("passes flags with dates ahead of the day the build runs", () => {
    expect(faultsOf(resolveFlags, contextFor(productOf([installed(switches)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it("refuses what a flag cannot state", () => {
    const context = contextFor(productOf([installed(faulty)]), { today: "2026-10-01" });

    expect(faultsOf(resolveFlags, context).problems).toStrictEqual([
      "faulty.featureFlags.lone.variants: lists fewer than two variants",
      "faulty.featureFlags.off.default: is not one of the variants",
      "faulty.featureFlags.open.expires: is required on an experiment",
      "faulty.featureFlags.typed.type: is string, and a release flag is boolean",
      "faulty.featureFlags.typed.default: is not of the flag's type, string",
      "faulty.featureFlags.undated.expires: is required on a release flag",
    ]);
  });

  it("warns of a flag past its date", () => {
    const context = contextFor(productOf([installed(faulty)]), { today: "2026-10-01" });

    expect(faultsOf(resolveFlags, context).warnings).toStrictEqual([
      "faulty.featureFlags.past.expires: is 2026-01-01, and the flag is past it",
    ]);
  });

  it.each([
    {
      flag: "switches/layout",
      line: 'product.featureFlags.0.value: is "grid", which switches/layout does not take',
      value: "grid",
    },
    {
      flag: "switches/layout",
      line: "product.featureFlags.0.value: is true, which switches/layout does not take",
      value: true,
    },
    {
      flag: "switches/sync",
      line: 'product.featureFlags.0.value: is "on", which switches/sync does not take',
      value: "on",
    },
    {
      flag: "billing/x",
      line: "product.featureFlags.0.flag: names the flag billing/x, which no installed plugin declares",
      value: true,
    },
  ])("refuses $value for $flag", ({ flag, line, value }) => {
    const context = contextFor(
      productOf([installed(switches)], { featureFlags: [{ flag, value }] }),
    );

    expect(faultsOf(resolveFlags, context).problems).toStrictEqual([line]);
  });

  it("refuses a value for a string flag that lists no variants", () => {
    const featureFlags = [{ flag: "faulty/typed", value: "on" }];
    const context = contextFor(productOf([installed(faulty)], { featureFlags }), {
      today: "2026-10-01",
    });

    expect(faultsOf(resolveFlags, context).problems).toContain(
      'product.featureFlags.0.value: is "on", which faulty/typed does not take',
    );
  });

  it("resolves every flag with a kill switch per installed plugin", () => {
    const featureFlags = [
      { flag: "time-off/calendar", value: true },
      { flag: "switches/layout", value: "board" },
      { flag: "host/plugin.switches", value: false },
    ];
    const definition = productOf([installed(timeOff), installed(switches)], { featureFlags });
    const flags = resolveFlags(contextFor(definition, { today: "2026-10-01" }), report());

    expect(flags.map(({ id, kind, plugin, product }) => [id, kind, plugin, product])).toStrictEqual(
      [
        ["time-off/calendar", "release", "time-off", true],
        ["switches/layout", "experiment", "switches", "board"],
        ["switches/sync", "ops", "switches", undefined],
        ["host/plugin.time-off", "ops", "host", undefined],
        ["host/plugin.switches", "ops", "host", false],
      ],
    );
  });

  it("resolves a kill switch on by default with the host's description", () => {
    const [, , kill] = resolveFlags(contextFor(productOf([installed(switches)])), report());

    expect(kill).toStrictEqual({
      default: true,
      description: "flags.killSwitch",
      id: "host/plugin.switches",
      kind: "ops",
      plugin: "host",
      product: undefined,
      type: "boolean",
    });
  });

  it("resolves an experiment with its variants as text", () => {
    const [layout] = resolveFlags(contextFor(productOf([installed(switches)])), report());

    expect(layout).toStrictEqual({
      default: "list",
      description: "flags.layout",
      expires: "2099-01-01",
      id: "switches/layout",
      kind: "experiment",
      plugin: "switches",
      product: undefined,
      type: "string",
      variants: ["list", "board"],
    });
  });
});
