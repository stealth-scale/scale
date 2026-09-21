import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

const SURFACE = [
  "atomicClass",
  "compoundClass",
  "conditionsOf",
  "isAtomic",
  "kebab",
  "rename",
  "sanitise",
  "slotClass",
  "variantClass",
];

describe("pandacss-naming", () => {
  it("publishes the scheme and the rewrite", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
