import { describe, expect, it } from "vitest";

import { declaredCases } from "#families.ts";
import { SHOP } from "#shop-manifest.fixtures.ts";

describe("declaredCases", () => {
  it("lists the code case first", () => {
    const names = declaredCases(SHOP).map(({ name }) => name);

    expect([names[0], names.at(-1)]).toStrictEqual([
      "the manifest has code for every declared name",
      "settings section shop/notice renders with its defaults",
    ]);
  });

  it("lists every family of case", () => {
    expect(declaredCases(SHOP)).toHaveLength(36);
  });
});
