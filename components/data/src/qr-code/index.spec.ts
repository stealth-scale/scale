import { describe, expect, it } from "vitest";

import * as QrCode from "#qr-code/index.ts";

describe("index", () => {
  it("exports the parts", () => {
    expect(Object.keys(QrCode).toSorted()).toStrictEqual([
      "DownloadTrigger",
      "Frame",
      "Overlay",
      "Pattern",
      "Root",
    ]);
  });
});
