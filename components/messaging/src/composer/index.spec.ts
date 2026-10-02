import { describe, expect, it } from "vitest";

import * as barrel from "#composer/index.ts";

describe("index", () => {
  it("exports the seven parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "AttachTrigger",
      "Attachments",
      "Context",
      "Input",
      "Root",
      "Submit",
      "Toolbar",
    ]);
  });
});
