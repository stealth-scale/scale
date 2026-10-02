import { describe, expect, it } from "vitest";

import { caseNamed, LEDGER, UNCODED } from "#checks.fixtures.ts";
import { flagCases, manifestCase, requirementCases } from "#declared.ts";
import { notesContract } from "#notes.fixtures.ts";

describe("declared", () => {
  it("passes the manifest that has code for every declared name", async () => {
    await expect(manifestCase(LEDGER).run()).resolves.toBeUndefined();
  });

  it("fails the manifest that lacks code for a declared name", async () => {
    await expect(manifestCase({ ...LEDGER, manifest: UNCODED }).run()).rejects.toThrow(
      "ledger.code.routes.paged is missing, and the contract declares the route",
    );
  });

  it("names one case per requirement", () => {
    expect(requirementCases(LEDGER).map(({ name }) => name)).toStrictEqual([
      "requirement notes ^1.0.0 admits the installed contract",
      "requirement tags ^9.0.0 admits the installed contract",
    ]);
  });

  it("passes a requirement whose range admits the contract installed beside", async () => {
    const found = caseNamed(
      requirementCases(LEDGER),
      "requirement notes ^1.0.0 admits the installed contract",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a requirement whose range refuses the contract installed beside", async () => {
    const found = caseNamed(
      requirementCases(LEDGER),
      "requirement tags ^9.0.0 admits the installed contract",
    );

    await expect(found.run()).rejects.toThrow(
      "ledger.requires.1 needs tags ^9.0.0, and 1.0.0 is installed",
    );
  });

  it("fails a requirement whose plugin is not installed beside", async () => {
    const found = caseNamed(
      requirementCases({ ...LEDGER, beside: [notesContract] }),
      "requirement tags ^9.0.0 admits the installed contract",
    );

    await expect(found.run()).rejects.toThrow(
      "ledger.requires.1 needs tags, which is not installed",
    );
  });

  it("names one case per flag with a date", () => {
    expect(flagCases(LEDGER).map(({ name }) => name)).toStrictEqual([
      "flag ledger/old is not past its date",
      "flag ledger/young is not past its date",
    ]);
  });

  it("passes a flag whose date is ahead", async () => {
    await expect(
      caseNamed(flagCases(LEDGER), "flag ledger/young is not past its date").run(),
    ).resolves.toBeUndefined();
  });

  it("fails a flag whose date is past", async () => {
    await expect(
      caseNamed(flagCases(LEDGER), "flag ledger/old is not past its date").run(),
    ).rejects.toThrow("ledger.featureFlags.old.expires is 2020-01-01, and the flag is past it");
  });
});
