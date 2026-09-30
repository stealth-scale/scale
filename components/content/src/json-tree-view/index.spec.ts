import { describe, expect, it } from "vitest";

import * as JsonTreeView from "#json-tree-view/index.ts";

describe("index", () => {
  it("exports the root and the tree", () => {
    expect(Object.keys(JsonTreeView).toSorted()).toStrictEqual(["Root", "Tree"]);
  });
});
