import { describe, expect, it } from "vitest";

import { StateProvider, useConversationState } from "#conversation/state.ts";

describe("state", () => {
  it("returns a provider and the hook that reads it", () => {
    expect([typeof StateProvider, typeof useConversationState]).toStrictEqual([
      "function",
      "function",
    ]);
  });
});
