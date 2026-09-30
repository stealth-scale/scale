import { describe, expect, it } from "vitest";

import * as barrel from "#timestamp/index.ts";

describe("index", () => {
  it("exports the timestamp", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Timestamp"]);
  });
});
