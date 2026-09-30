import { describe, expect, it } from "vitest";

import * as barrel from "#iframe/index.ts";

describe("index", () => {
  it("exports Iframe and no other runtime name", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Iframe"]);
  });
});
