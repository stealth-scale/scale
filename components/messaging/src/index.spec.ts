import { describe, expect, it } from "vitest";

import * as messaging from "#index.ts";

describe("index", () => {
  it("exports the kits beside groupTurns at run time", () => {
    expect(Object.keys(messaging).toSorted()).toStrictEqual([
      "Attachment",
      "Composer",
      "Conversation",
      "Message",
      "Reactions",
      "groupTurns",
    ]);
  });
});
