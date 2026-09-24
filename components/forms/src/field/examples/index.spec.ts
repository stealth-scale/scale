import { describe, expect, it } from "vitest";

import * as examples from "#field/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "email",
      "name",
      "notes",
      "optional",
      "signup",
      "subscribe",
    ]);
  });
});
