import { describe, expect, it } from "vitest";

import * as barrel from "#download-trigger/index.ts";

describe("index", () => {
  it("exports only the two public names", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["DownloadTrigger", "download"]);
  });
});
