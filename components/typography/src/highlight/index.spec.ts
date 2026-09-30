import { describe, expect, it } from "vitest";

import * as barrel from "#highlight/index.ts";

describe("index", () => {
  it("exports the highlight", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Highlight"]);
  });
});
