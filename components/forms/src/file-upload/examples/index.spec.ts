import { describe, expect, it } from "vitest";

import * as examples from "#file-upload/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "attachments",
      "evidence",
      "folder",
      "photo",
      "receipts",
      "refused",
      "screenshots",
      "statement",
    ]);
  });
});
