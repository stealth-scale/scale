import { describe, expect, it } from "vitest";

import * as examples from "#qr-code/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "authenticator",
      "download",
      "invite",
      "live",
      "mark",
      "network",
    ]);
  });
});
