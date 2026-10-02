import { describe, expect, it } from "vitest";

import * as context from "#graph/context.ts";

describe("context", () => {
  it("exports the recipe's bindings", () => {
    expect(Object.keys(context).toSorted()).toStrictEqual(["withContext", "withProvider"]);
  });
});
