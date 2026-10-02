import { describe, expect, it } from "vitest";

import * as barrel from "#turns/index.ts";

describe("index", () => {
  it("exports groupTurns and no other runtime name", () => {
    expect(Object.keys(barrel)).toStrictEqual(["groupTurns"]);
  });
});
