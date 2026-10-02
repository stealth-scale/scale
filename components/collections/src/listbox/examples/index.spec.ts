import { describe, expect, it } from "vitest";

import * as examples from "#listbox/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "clients",
      "consignments",
      "described",
      "everything",
      "filtered",
      "grouped",
      "held",
      "kinds",
      "locked",
      "ports",
      "triggered",
    ]);
  });
});
