import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { plain } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { checkFirst, checkLast } from "#resolve/checks.ts";
import { contextOf } from "#resolve/context.ts";
import { teams } from "#resolve/requirements.fixtures.ts";
import { contextFor, faultsOf, manifestOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("checks", () => {
  it("runs the first three checks in the resolver's order", () => {
    const definition = productOf([installed(plain), installed(teams)], {
      signIn: { id: "plain/home", kind: "route" },
    });

    expect(faultsOf(checkFirst, contextOf(definition, {}, {})).problems).toStrictEqual([
      "plain: has no web package among the product's dependencies",
      "teams: has no web package among the product's dependencies",
      "teams.requires.0: needs identity, which is not installed",
      "product.signIn: names the route plain/home, which plain does not declare",
    ]);
  });

  it("runs the last three checks in the resolver's order", () => {
    const plugin = { ...installed(manifestOf(timeOffContract)), config: { approvers: "2" } };
    const definition = productOf([plugin]);
    const context = contextFor(definition, { catalogues: {} });

    expect(faultsOf(checkLast, context).problems).toStrictEqual([
      "product.plugins.time-off.config.approvers: is a string, and the property takes a number",
      "time-off: has no catalogue in the fallback language",
      "product.name: names the key product.name, which the fallback catalogue of people lacks",
      "time-off.code.commands.approve: is missing, and the contract declares the command",
      "time-off.code.commands.request: is missing, and the contract declares the command",
      "time-off.code.extensions.balance: is missing, and the contract declares the extension",
      "time-off.code.routes.overview: is missing, and the contract declares the route",
      "time-off.code.routes.request: is missing, and the contract declares the route",
    ]);
  });
});
