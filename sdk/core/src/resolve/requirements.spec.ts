import { describe, expect, it } from "vitest";

import { installed } from "#product.ts";
import {
  alpha,
  audit,
  beta,
  identity,
  lenient,
  stale,
  teams,
  unversioned,
} from "#resolve/requirements.fixtures.ts";
import { checkRequirements, cycleOf } from "#resolve/requirements.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("requirements", () => {
  it("passes a requirement installed within its range", () => {
    const context = contextFor(productOf([installed(identity), installed(teams)]));

    expect(faultsOf(checkRequirements, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a required plugin that is not installed", () => {
    const context = contextFor(productOf([installed(teams)]));

    expect(faultsOf(checkRequirements, context).problems).toStrictEqual([
      "teams.requires.0: needs identity, which is not installed",
    ]);
  });

  it("passes an optional plugin that is not installed", () => {
    const context = contextFor(productOf([installed(audit)]));

    expect(faultsOf(checkRequirements, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a required plugin installed outside its range", () => {
    const context = contextFor(productOf([installed(identity), installed(stale)]));

    expect(faultsOf(checkRequirements, context).problems).toStrictEqual([
      "stale.requires.0: needs identity ^0.3.0, and 0.4.2 is installed",
    ]);
  });

  it("warns of an optional plugin installed outside its range", () => {
    const context = contextFor(productOf([installed(identity), installed(audit)]));

    expect(faultsOf(checkRequirements, context)).toStrictEqual({
      problems: [],
      warnings: ["audit.requires.0: needs identity ^0.3.0, and 0.4.2 is installed"],
    });
  });

  it("passes a requirement on a contract that states no version", () => {
    const context = contextFor(productOf([installed(unversioned), installed(lenient)]));

    expect(faultsOf(checkRequirements, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses requirements that form a cycle", () => {
    const context = contextFor(productOf([installed(alpha), installed(beta)]));

    expect(faultsOf(checkRequirements, context).problems).toStrictEqual([
      "alpha.requires: forms a cycle: alpha → beta → alpha",
    ]);
  });

  it("finds no cycle in a graph without one", () => {
    const graph = new Map([
      ["a", ["b", "c"]],
      ["b", ["c"]],
    ]);

    expect(cycleOf(graph)).toBeUndefined();
  });

  it("finds a cycle from the node it starts at", () => {
    const graph = new Map([
      ["a", ["b"]],
      ["b", ["c"]],
      ["c", ["b"]],
    ]);

    expect(cycleOf(graph)).toStrictEqual({ from: "b", through: ["b", "c", "b"] });
  });
});
