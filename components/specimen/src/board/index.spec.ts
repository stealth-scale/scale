import { describe, expect, it } from "vitest";

import * as barrel from "#board/index.ts";

describe("index", () => {
  it("names everything the board publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Board"]);
  });
});
