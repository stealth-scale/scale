import { describe, expect, it } from "vitest";

import * as examples from "#tags-input/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "accounts",
      "invite",
      "keywords",
      "labels",
      "recipients",
      "skills",
    ]);
  });
});
