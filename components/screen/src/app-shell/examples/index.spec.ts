import { describe, expect, it } from "vitest";

import * as examples from "#app-shell/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "billing",
      "canvas",
      "chat",
      "checkout",
      "console",
      "handbook",
      "journal",
      "mail",
      "player",
      "reader",
      "storefront",
    ]);
  });
});
