import { describe, expect, it } from "vitest";

import * as examples from "#avatar/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "badged",
      "badges",
      "byline",
      "person",
      "pictures",
      "presence",
      "services",
      "team",
    ]);
  });
});
