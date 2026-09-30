import { describe, expect, it } from "vitest";

import * as barrel from "#attachment/index.ts";

describe("index", () => {
  it("exports the seven parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Actions",
      "Content",
      "Description",
      "Group",
      "Media",
      "Root",
      "Title",
    ]);
  });
});
