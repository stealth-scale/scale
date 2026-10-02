import { describe, expect, it } from "vitest";

import { ledger, ledgerContract } from "#checks.fixtures.ts";
import { checks } from "#checks.ts";
import { NOTES } from "#manifest.fixtures.ts";
import { notesContract, tagsContract } from "#notes.fixtures.ts";

describe("checks", () => {
  it("lists the cases of a plugin in the order the checks are listed", () => {
    expect(checks(NOTES.contract, NOTES.manifest).map(({ name }) => name)).toStrictEqual([
      "the manifest has code for every declared name",
      "route notes/list imports one component",
      "route notes/note imports one component",
      "extension notes/badge imports one component",
      "route notes/list renders at its sample",
      "route notes/note renders at its sample",
      "extension notes/badge renders with its target's props",
      "settings section notes/display renders with its defaults",
      "settings section notes/display's defaults pass its schema",
      "flag notes/archive is not past its date",
      "flag notes/layout is not past its date",
      "every key the contract names is in the fallback catalogue",
      "plugin.name is in the fallback catalogue",
      "plugin.description is in the fallback catalogue",
    ]);
  });

  it("adds the recipe case where the options state the theme", () => {
    const names = checks(NOTES.contract, NOTES.manifest, { theme: {} }).map(({ name }) => name);

    expect(names).toContain("every recipe starts with the plugin id");
  });

  it("installs the contracts beside the plugin in every case", async () => {
    const cases = checks(ledgerContract, ledger, { beside: [notesContract, tagsContract] });
    const found = cases.find(
      ({ name }) => name === "requirement notes ^1.0.0 admits the installed contract",
    );

    await expect(found?.run()).resolves.toBeUndefined();
  });

  it("lists the query cases before the mutation cases", () => {
    const names = checks(ledgerContract, ledger).map(({ name }) => name);

    expect(names.slice(-4)).toStrictEqual([
      "query ledger/found finds records in its sample",
      "query ledger/lost finds records in its sample",
      "mutation ledger/breaks's changes name variables its sample states",
      "mutation ledger/saves's changes name variables its sample states",
    ]);
  });
});
