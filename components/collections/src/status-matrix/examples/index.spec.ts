import { describe, expect, it } from "vitest";

import * as examples from "#status-matrix/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "empty",
      "gapped",
      "health",
      "plumbing",
      "queues",
    ]);
  });
});
