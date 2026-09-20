import { describe, expect, it } from "vitest";

import * as barrel from "#framed/index.ts";

describe("index", () => {
  it("names every export and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["framedDeclaration"]);
  });
});
