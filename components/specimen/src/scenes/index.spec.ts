import { describe, expect, it } from "vitest";

import * as barrel from "#scenes/index.ts";

describe("index", () => {
  it("names everything the generator publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Drawn", "scenesOf", "stale", "written"]);
  });
});
