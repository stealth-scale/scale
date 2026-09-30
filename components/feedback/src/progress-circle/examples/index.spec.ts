import { describe, expect, it } from "vitest";

import * as examples from "#progress-circle/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "checklist",
      "quota",
      "syncing",
      "upload",
    ]);
  });
});
