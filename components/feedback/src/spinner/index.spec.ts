import { describe, expect, it } from "vitest";

import * as barrel from "#spinner/index.ts";

describe("index", () => {
  it("exports Spinner and no other runtime name", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Spinner"]);
  });
});
