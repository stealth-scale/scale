import { describe, expect, it } from "vitest";

import * as examples from "#pagination/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "edges",
      "invoices",
      "links",
      "results",
      "wording",
    ]);
  });
});
