import { describe, expect, it } from "vitest";

import * as examples from "#heatmap/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "attendance",
      "authorisations",
      "bookings",
      "builds",
      "clinic",
      "deploys",
      "depots",
      "incidents",
      "pages",
      "palette",
      "quarter",
      "quiet",
      "readout",
      "signups",
      "sizes",
      "variance",
      "wards",
    ]);
  });
});
