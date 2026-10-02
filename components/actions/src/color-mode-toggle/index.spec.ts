import { describe, expect, it } from "vitest";

import * as barrel from "#color-mode-toggle/index.ts";

describe("index", () => {
  it("exports the toggle", () => {
    expect(Object.keys(barrel)).toStrictEqual(["ColorModeToggle"]);
  });
});
