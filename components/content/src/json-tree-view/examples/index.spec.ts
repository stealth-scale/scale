import { describe, expect, it } from "vitest";

import * as examples from "#json-tree-view/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "depth",
      "links",
      "log",
      "previews",
      "quoted",
      "response",
      "secrets",
      "types",
    ]);
  });
});
