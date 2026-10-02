import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import {
  away,
  earlier,
  fan,
  framed,
  ghost,
  later,
  legacy,
  legacyContract,
  needy,
  odd,
  prerelease,
} from "#resolve/references.fixtures.ts";
import { checkReferences } from "#resolve/references.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("checkReferences", () => {
  it("passes references to names the installed contracts declare", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(legacy), installed(framed)]),
    );

    expect(faultsOf(checkReferences, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a name the installed contract does not declare", () => {
    const context = contextFor(productOf([installed(timeOff), installed(ghost)]));

    expect(faultsOf(checkReferences, context).problems).toStrictEqual([
      "ghost.extensions.badge-0.target: names the slot time-off/missing, which time-off does not declare",
    ]);
  });

  it("leaves a reference to a plugin that is not installed to its area", () => {
    const context = contextFor(productOf([installed(away)]));

    expect(faultsOf(checkReferences, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a reference made against a later version than the one installed", () => {
    const context = contextFor(productOf([installed(timeOff), installed(later)]));

    expect(faultsOf(checkReferences, context).problems).toStrictEqual([
      "later.extensions.badge-0.target: was made against time-off 0.5.0, and 0.4.0 is installed",
    ]);
  });

  it("warns of a reference made against an earlier major", () => {
    const context = contextFor(productOf([installed(timeOff), installed(earlier)]));

    expect(faultsOf(checkReferences, context)).toStrictEqual({
      problems: [],
      warnings: [
        "earlier.extensions.badge-0.target: was made against time-off 0.3.0, and 0.4.0 is installed",
      ],
    });
  });

  it("passes a reference made against a prerelease the installed version admits", () => {
    const context = contextFor(productOf([installed(timeOff), installed(prerelease)]));

    expect(faultsOf(checkReferences, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a reference version that is not a version", () => {
    const context = contextFor(productOf([installed(timeOff), installed(odd)]));

    expect(faultsOf(checkReferences, context).problems).toStrictEqual([
      'odd.extensions.badge-0.target.version: is not a version: "four"',
    ]);
  });

  it("warns once per plugin that names a deprecated name", () => {
    const context = contextFor(productOf([installed(legacy), installed(fan)]));

    expect(faultsOf(checkReferences, context).warnings).toStrictEqual([
      "fan.extensions.badge-0.target: names the deprecated slot legacy/old (use legacy/new)",
    ]);
  });

  it("refuses a command a manifest's code needs that the installed contract lacks", () => {
    const context = contextFor(productOf([installed(timeOff), installed(needy)]));

    expect(faultsOf(checkReferences, context).problems).toStrictEqual([
      "needy.code.commands.delegate.needs.missing: names the command time-off/missing, which time-off does not declare",
    ]);
  });

  it("refuses a name the product states that the installed contract lacks", () => {
    const definition = productOf([installed(timeOff), installed(legacy)], {
      extensions: { disabled: [{ id: "legacy/gone", kind: "extension" }] },
      signIn: { id: "time-off/sign-in", kind: "route" },
      slots: [{ add: [timeOffContract.extensions.balance], slot: legacyContract.slots.new }],
      when: { permission: { id: "time-off/request.delete", kind: "permission" } },
    });

    expect(faultsOf(checkReferences, contextFor(definition)).problems).toStrictEqual([
      "product.signIn: names the route time-off/sign-in, which time-off does not declare",
      "product.when.permission: names the permission time-off/request.delete, which time-off does not declare",
      "product.extensions.disabled.0: names the extension legacy/gone, which legacy does not declare",
    ]);
  });

  it("refuses a name a plugin's condition states that the installed contract lacks", () => {
    const when = { not: { featureFlag: { id: "time-off/layout", kind: "featureFlag" as const } } };
    const context = contextFor(productOf([installed(timeOff, { when })]));

    expect(faultsOf(checkReferences, context).problems).toStrictEqual([
      "product.plugins.time-off.when.not.featureFlag: names the feature flag time-off/layout, which time-off does not declare",
    ]);
  });

  it("follows no reference inside a condition's plugin", () => {
    const when = { plugin: legacyContract };
    const context = contextFor(productOf([installed(timeOff, { when }), installed(legacy)]));

    expect(faultsOf(checkReferences, context)).toStrictEqual({ problems: [], warnings: [] });
  });
});
