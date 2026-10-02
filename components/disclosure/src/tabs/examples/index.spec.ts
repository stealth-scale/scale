import { describe, expect, it } from "vitest";

import * as examples from "#tabs/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "account",
      "drafts",
      "files",
      "preferences",
      "reader",
    ]);
  });
});
