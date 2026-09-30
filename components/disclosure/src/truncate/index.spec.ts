import { describe, expect, it } from "vitest";

import * as barrel from "#truncate/index.ts";

describe("index", () => {
  it("exports the truncate", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Truncate"]);
  });
});
