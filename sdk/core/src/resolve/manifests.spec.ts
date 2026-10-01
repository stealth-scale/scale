import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { lazy, overview, request } from "#manifest.fixtures.ts";
import { plainContract, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { checkManifests } from "#resolve/manifests.ts";
import { contextFor, faultsOf, manifestOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("checkManifests", () => {
  it("passes a manifest with code for every name that needs it", () => {
    expect(faultsOf(checkManifests, contextFor(productOf([installed(timeOff)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it("refuses a manifest that lacks code for a declared name", () => {
    const context = contextFor(productOf([installed(manifestOf(timeOffContract))]));

    expect(faultsOf(checkManifests, context).problems).toStrictEqual([
      "time-off.code.commands.approve: is missing, and the contract declares the command",
      "time-off.code.commands.request: is missing, and the contract declares the command",
      "time-off.code.extensions.balance: is missing, and the contract declares the extension",
      "time-off.code.routes.overview: is missing, and the contract declares the route",
      "time-off.code.routes.request: is missing, and the contract declares the route",
    ]);
  });

  it("refuses code for a name the contract does not declare", () => {
    const manifest = manifestOf(plainContract, {
      commands: { ghost: { run: lazy({ request }) } },
      extensions: { ghost: { component: lazy({ overview }) } },
      routes: { ghost: lazy({ overview }) },
      settings: { ghost: {} },
    });

    expect(
      faultsOf(checkManifests, contextFor(productOf([installed(manifest)]))).problems,
    ).toStrictEqual([
      "plain.code.commands.ghost: names a command the contract does not declare",
      "plain.code.extensions.ghost: names an extension the contract does not declare",
      "plain.code.routes.ghost: names a route the contract does not declare",
      "plain.code.settings.ghost: names a settings section the contract does not declare",
    ]);
  });
});
