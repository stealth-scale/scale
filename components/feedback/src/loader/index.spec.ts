import { describe, expect, it } from "vitest";

import * as barrel from "#loader/index.ts";

describe("index", () => {
  it("exports Loader and LoaderOverlay and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Loader", "LoaderOverlay"]);
  });
});
