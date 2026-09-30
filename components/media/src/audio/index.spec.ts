import { describe, expect, it } from "vitest";

import * as barrel from "#audio/index.ts";

describe("index", () => {
  it("exports Audio and no other runtime name", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Audio"]);
  });
});
