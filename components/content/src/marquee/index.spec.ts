import { describe, expect, it } from "vitest";

import * as Marquee from "#marquee/index.ts";

describe("index", () => {
  it("exports the seven parts", () => {
    expect(Object.keys(Marquee).toSorted()).toStrictEqual([
      "Content",
      "Edge",
      "Item",
      "PauseIndicator",
      "PauseTrigger",
      "Root",
      "Viewport",
    ]);
  });
});
