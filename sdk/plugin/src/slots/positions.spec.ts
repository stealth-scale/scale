import { describe, expect, it } from "vitest";

import { positionsOf } from "#slots/positions.ts";
import { extensionOf, idsOf } from "#slots/slots.fixtures.ts";

describe("positionsOf", () => {
  it("sorts the attached extensions by position", () => {
    const positions = positionsOf([
      extensionOf("a/outer", { position: "wrap" }),
      extensionOf("a/lead", { position: "before" }),
      extensionOf("a/first", { position: "replace" }),
      extensionOf("a/last", { position: "replace" }),
      extensionOf("a/tail", { position: "after" }),
      extensionOf("a/inner", { position: "wrap" }),
    ]);

    expect([
      idsOf(positions.before),
      positions.replacing?.id,
      idsOf(positions.after),
      idsOf(positions.wraps),
    ]).toStrictEqual([["a/lead"], "a/last", ["a/tail"], ["a/inner", "a/outer"]]);
  });

  it("leaves the content in place where no extension replaces it", () => {
    expect(positionsOf([extensionOf("a/tail")]).replacing).toBeUndefined();
  });
});
