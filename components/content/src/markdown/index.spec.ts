import { describe, expect, it } from "vitest";

import * as barrel from "#markdown/index.ts";

describe("index", () => {
  it("exports Markdown alone at run time", () => {
    expect(Object.keys(barrel)).toStrictEqual(["Markdown"]);
  });
});
