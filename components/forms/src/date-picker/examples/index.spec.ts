import { describe, expect, it } from "vitest";

import * as examples from "#date-picker/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "appointment",
      "availability",
      "billing",
      "birthday",
      "daysOff",
      "german",
      "holiday",
      "report",
      "start",
      "states",
    ]);
  });
});
