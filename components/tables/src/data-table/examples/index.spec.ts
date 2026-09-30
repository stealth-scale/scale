import { describe, expect, it } from "vitest";

import * as examples from "#data-table/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "aggregates",
      "claims",
      "columns",
      "details",
      "endless",
      "filters",
      "grid",
      "grouped",
      "lazy",
      "manager",
      "menus",
      "pages",
      "pinned",
      "pivot",
      "search",
      "selection",
      "server",
      "sorting",
      "spanned",
      "totals",
      "tree",
      "windowed",
    ]);
  });
});
