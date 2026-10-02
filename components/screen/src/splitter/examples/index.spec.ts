import { describe, expect, it } from "vitest";

import * as examples from "#splitter/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "basic",
      "controlled",
      "locked",
      "mail",
      "nested",
      "notes",
      "query",
    ]);
  });
});
