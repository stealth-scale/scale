import { describe, expect, it } from "vitest";

import { StateProvider, useComposerState } from "#composer/state.ts";

describe("state", () => {
  it("returns a provider and the hook that reads it", () => {
    expect([typeof StateProvider, typeof useComposerState]).toStrictEqual(["function", "function"]);
  });
});
