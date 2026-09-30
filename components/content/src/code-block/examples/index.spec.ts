import { describe, expect, it } from "vitest";

import * as examples from "#code-block/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "log",
      "manifest",
      "manifests",
      "payout",
      "policy",
      "pullRequest",
      "rewrite",
      "send",
      "sideBySide",
      "unchanged",
    ]);
  });
});
