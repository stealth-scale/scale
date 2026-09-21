import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names everything the plugin publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ID",
      "PROPS",
      "UPDATED",
      "isRefused",
      "read",
      "specimens",
    ]);
  });
});
