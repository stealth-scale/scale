import { describe, expect, it } from "vitest";

import * as FloatingPanel from "#floating-panel/index.ts";

describe("index", () => {
  it("exports the thirteen parts", () => {
    expect(Object.keys(FloatingPanel).toSorted()).toStrictEqual([
      "Body",
      "CloseTrigger",
      "Content",
      "Control",
      "DragTrigger",
      "Header",
      "Positioner",
      "ResizeTrigger",
      "ResizeTriggers",
      "Root",
      "StageTrigger",
      "Title",
      "Trigger",
    ]);
  });
});
