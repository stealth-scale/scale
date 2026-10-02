import { describe, expect, it } from "vitest";

import * as barrel from "#date-input/index.ts";

describe("index", () => {
  it("exports the seven parts and the functions that create a date", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Control",
      "Label",
      "Root",
      "Segment",
      "SegmentGroup",
      "Segments",
      "getLocalTimeZone",
      "parseDate",
      "parseDateTime",
      "parseZonedDateTime",
      "today",
    ]);
  });
});
