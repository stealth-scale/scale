import { describe, expect, it } from "vitest";

import { GroupProvider, useGroupDefaults } from "#attachment/state.ts";

describe("state", () => {
  it("returns a provider and the hook that reads it", () => {
    expect([typeof GroupProvider, typeof useGroupDefaults]).toStrictEqual(["function", "function"]);
  });
});
