import { describe, expect, it } from "vitest";

import { headings } from "#catalogue/headings.ts";
import { type Part } from "#catalogue/parted.ts";

/**
 * Writes one part under the name a case asks for.
 */
function part(name: string): Part {
  return {
    component: `Kit.${name}`,
    dropped: { conditions: 0, foreign: 0 },
    name,
    options: [],
    variants: [],
  };
}

describe("headings", () => {
  it("lists each part under the component its props belong to", () => {
    expect(headings([part("One"), part("Two")]).map((one) => one.title)).toStrictEqual([
      "Kit.One",
      "Kit.Two",
    ]);
  });

  it("anchors each heading by the part's own name", () => {
    expect(headings([part("ButtonProps")])[0]?.id).toBe("buttonprops");
  });

  it("lists nothing for a page with no parts", () => {
    expect(headings([])).toStrictEqual([]);
  });
});
