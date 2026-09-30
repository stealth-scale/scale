import { describe, expect, it } from "vitest";

import * as overlay from "#overlay/index.ts";

describe("index", () => {
  it("limits its runtime exports to createOverlay", () => {
    expect(Object.keys(overlay)).toStrictEqual(["createOverlay"]);
  });
});
