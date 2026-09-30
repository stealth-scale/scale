import { describe, expect, it } from "vitest";

import * as hierarchy from "#hierarchy/index.ts";

describe("index", () => {
  it("exports hierarchyLeaves", () => {
    expect(Object.keys(hierarchy)).toStrictEqual(["hierarchyLeaves"]);
  });
});
