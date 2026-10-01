import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { plain, plainContract, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { killSwitchOf, resolvePlugins } from "#resolve/plugins.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, linesOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("plugins", () => {
  it("names a plugin's kill switch under the host", () => {
    expect(killSwitchOf("time-off")).toBe("host/plugin.time-off");
  });

  it("resolves a plugin with the defaults of every option", () => {
    const context = contextFor(productOf([installed(timeOff)]));

    expect(resolvePlugins(context, report())).toStrictEqual([
      {
        config: { approvers: 1 },
        eager: false,
        enabled: true,
        id: "time-off",
        killSwitch: "host/plugin.time-off",
        locked: false,
        requires: [],
        version: "0.4.0",
        when: undefined,
      },
    ]);
  });

  it("resolves a plugin with the options the product states", () => {
    const when = { authenticated: true };
    const options = { config: { approvers: 2 }, eager: true, enabled: false, locked: true, when };
    const [resolved] = resolvePlugins(
      contextFor(productOf([installed(timeOff, options)])),
      report(),
    );

    expect(resolved).toMatchObject({ ...options, config: { approvers: 2 } });
  });

  it("refuses a route in a plugin's condition", () => {
    const when = { anyOf: [{ route: timeOffContract.routes.overview }] };
    const context = contextFor(productOf([installed(timeOff), installed(plain, { when })]));

    expect(faultsOf(resolvePlugins, context).problems).toStrictEqual([
      "product.plugins.plain.when.anyOf.0.route: is refused in a plugin's condition, which no route matches",
    ]);
  });

  it("refuses a condition that names its own plugin", () => {
    const context = contextFor(productOf([installed(plain, { when: { plugin: plainContract } })]));

    expect(faultsOf(resolvePlugins, context).problems).toStrictEqual([
      "product.plugins.plain.when.plugin: names the plugin it is a condition of",
    ]);
  });

  it("refuses conditions that name each other in a ring", () => {
    const faults = report();
    const context = contextFor(
      productOf([
        installed(timeOff, { when: { not: { plugin: plainContract } } }),
        installed(plain, { when: { plugin: timeOffContract } }),
      ]),
    );

    resolvePlugins(context, faults);

    expect(linesOf(faults).problems).toStrictEqual([
      "product.plugins.time-off.when: forms a cycle through plugin: time-off → plain → time-off",
    ]);
  });
});
