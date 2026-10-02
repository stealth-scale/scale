import { describe, expect, it } from "vitest";

import { caseNamed, ledgerContract } from "#checks.fixtures.ts";
import { mutationCases, queryCases } from "#data.ts";

describe("data", () => {
  it("names one case per query with selectors", () => {
    expect(queryCases(ledgerContract).map(({ name }) => name)).toStrictEqual([
      "query ledger/found finds records in its sample",
      "query ledger/lost finds records in its sample",
    ]);
  });

  it("passes a query whose selectors find records in its sample", async () => {
    const found = caseNamed(
      queryCases(ledgerContract),
      "query ledger/found finds records in its sample",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a query whose selectors find no record in its sample", async () => {
    const found = caseNamed(
      queryCases(ledgerContract),
      "query ledger/lost finds records in its sample",
    );

    await expect(found.run()).rejects.toThrow(
      [
        "The record selector 0 of query ledger/lost finds no record in its sample.",
        "The decision selector 0 of query ledger/lost finds no record in its sample.",
      ].join("\n"),
    );
  });

  it("names one case per mutation whose changes name a variable", () => {
    expect(mutationCases(ledgerContract).map(({ name }) => name)).toStrictEqual([
      "mutation ledger/breaks's changes name variables its sample states",
      "mutation ledger/saves's changes name variables its sample states",
    ]);
  });

  it("passes a mutation whose sample states the variable a change names", async () => {
    const found = caseNamed(
      mutationCases(ledgerContract),
      "mutation ledger/saves's changes name variables its sample states",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a mutation whose sample lacks the variable a change names", async () => {
    const found = caseNamed(
      mutationCases(ledgerContract),
      "mutation ledger/breaks's changes name variables its sample states",
    );

    await expect(found.run()).rejects.toThrow(
      "The change 0 of mutation ledger/breaks names noteId, which its sample's variables lack.",
    );
  });
});
