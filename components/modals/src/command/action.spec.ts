import { describe, expect, it } from "vitest";

import { type CommandAction, gathered, labelOf, valueOf } from "#command/action.ts";

/**
 * A grouped action.
 */
const INVOICES: CommandAction = { group: "Go to", label: "Invoices", value: "invoices" };

/**
 * A second action carrying the same group, so grouping has something to collect.
 */
const REPORTS: CommandAction = { group: "Go to", label: "Reports", value: "reports" };

/**
 * An action with no group at all.
 */
const NEW: CommandAction = { label: "New document", value: "new" };

describe("labelOf", () => {
  it("returns the label of the action it is given", () => {
    expect(labelOf(INVOICES)).toBe("Invoices");
  });
});

describe("valueOf", () => {
  it("returns the value of the action it is given", () => {
    expect(valueOf(INVOICES)).toBe("invoices");
  });
});

describe("gathered", () => {
  it("returns one entry per distinct group", () => {
    expect(gathered([INVOICES, NEW, REPORTS]).map(([heading]) => heading)).toStrictEqual([
      "Go to",
      "",
    ]);
  });

  it("collects actions sharing a group into that group's entry", () => {
    expect(gathered([INVOICES, NEW, REPORTS])[0]?.[1].map(labelOf)).toStrictEqual([
      "Invoices",
      "Reports",
    ]);
  });

  it("files an action with no group under the empty string", () => {
    expect(gathered([INVOICES, NEW, REPORTS])[1]?.[1].map(labelOf)).toStrictEqual(["New document"]);
  });

  it("orders the entries by where each group first appeared in the input", () => {
    expect(gathered([NEW, INVOICES]).map(([heading]) => heading)).toStrictEqual(["", "Go to"]);
  });

  it("returns an empty array when given no actions", () => {
    expect(gathered([])).toStrictEqual([]);
  });
});
