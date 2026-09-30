import { describe, expect, it } from "vitest";

import * as barrel from "#conversation/index.ts";

describe("index", () => {
  it("exports the four parts and the hook and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "JumpTrigger",
      "Root",
      "Typing",
      "useConversation",
    ]);
  });
});
