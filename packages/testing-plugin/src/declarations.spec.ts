import { describe, expect, it } from "vitest";

import { defineContract, definePlugin, route } from "@stealthscale/sdk-core";

import { caseNamed, DOUBLED, LEDGER, permitted, UNCODED } from "#checks.fixtures.ts";
import { declarationCases } from "#declarations.ts";
import { lazy } from "#notes.fixtures.ts";

function page(): string {
  return "page";
}

const gatedContract = defineContract("gated", () => ({
  routes: {
    closed: route({
      path: "closed",
      when: { allOf: [permitted("gated/read"), { not: permitted("gated/read") }] },
    }),
    open: route({
      path: "open",
      when: { anyOf: [{ authenticated: true }, { authenticated: false }] },
    }),
    wide: route({
      path: "wide",
      when: { allOf: Array.from({ length: 17 }, (_, index) => permitted(`gated/p${index}`)) },
    }),
  },
  version: "1.0.0",
}));

const gated = definePlugin(gatedContract, {
  routes: { closed: lazy({ page }), open: lazy({ page }), wide: lazy({ page }) },
});

const GATED = { beside: [], contract: gatedContract, manifest: gated };

describe("declarationCases", () => {
  it("lists the import case of each declaration before its condition case", () => {
    expect(declarationCases(LEDGER).map(({ name }) => name)).toStrictEqual([
      "route ledger/home imports one component",
      "route ledger/paged imports one component",
      "route ledger/paged's condition is not constant",
      "extension ledger/badge imports one component",
      "command ledger/archive imports one function",
      "command ledger/archive's condition is not constant",
    ]);
  });

  it("passes the import of a module of one function", async () => {
    const found = caseNamed(declarationCases(LEDGER), "route ledger/paged imports one component");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails the import of a module of two functions", async () => {
    const cases = declarationCases({ ...LEDGER, manifest: DOUBLED });

    await expect(caseNamed(cases, "route ledger/home imports one component").run()).rejects.toThrow(
      "route ledger/home imports a module that exports 2 functions, and the host takes one.",
    );
  });

  it("fails the import of a declaration without code", async () => {
    const cases = declarationCases({ ...LEDGER, manifest: UNCODED });

    await expect(
      caseNamed(cases, "route ledger/paged imports one component").run(),
    ).rejects.toThrow("route ledger/paged has no code in the manifest.");
  });

  it("passes a condition that takes both values", async () => {
    const found = caseNamed(
      declarationCases(LEDGER),
      "command ledger/archive's condition is not constant",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a condition false in every context", async () => {
    const found = caseNamed(
      declarationCases(GATED),
      "route gated/closed's condition is not constant",
    );

    await expect(found.run()).rejects.toThrow(
      "route gated/closed has a condition that is false in every context, so it is never routed.",
    );
  });

  it("fails a condition true in every context", async () => {
    const found = caseNamed(
      declarationCases(GATED),
      "route gated/open's condition is not constant",
    );

    await expect(found.run()).rejects.toThrow(
      "route gated/open has a condition that is true in every context, so it gates nothing.",
    );
  });

  it("fails a condition of more contexts than the search evaluates", async () => {
    const found = caseNamed(
      declarationCases(GATED),
      "route gated/wide's condition is not constant",
    );

    await expect(found.run()).rejects.toThrow(
      "route gated/wide has a condition of 131072 contexts, and the search stops at 65,536.",
    );
  });
});
