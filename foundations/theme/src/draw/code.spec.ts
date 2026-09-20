import { describe, expect, it } from "vitest";

import { CODE } from "#contract.ts";
import { coded } from "#draw/code.ts";
import { lightnessOf } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { modedAt } from "#tokens.fixtures.ts";

const { code } = coded(FOUNDATION);

describe("coded", () => {
  it("inks every kind of token", () => {
    expect(Object.keys(code).toSorted()).toStrictEqual([...CODE].toSorted());
  });

  it("inks a comment from the muted ink", () => {
    expect(code.comment).toStrictEqual({ value: "{colors.fg.muted}" });
  });

  it("inks a kind from the foundation's hue pushed the code distance from the page", () => {
    expect(modedAt(code, "keyword", "base")).toBe("oklch(39.0% 0.1191 299.4)");
    expect(modedAt(code, "keyword", "_dark")).toBe("oklch(73.0% 0.1446 299.9)");
    expect(modedAt(code, "string", "base")).toBe("oklch(39.0% 0.0806 59.1)");
  });

  it("inks a kind from the color a theme names for it at the same distance", () => {
    const own = coded(FOUNDATION, { comment: "#888888", keyword: "#d72323" }).code;

    expect(lightnessOf(modedAt(own, "keyword", "base"))).toBeCloseTo(0.39, 2);
    expect(lightnessOf(modedAt(own, "keyword", "_dark"))).toBeCloseTo(0.73, 2);
    expect(modedAt(own, "comment", "base")).not.toBe("{colors.fg.muted}");
  });

  it("leaves a color that already stands the distance from the page", () => {
    const own = coded(FOUNDATION, { keyword: "oklch(20% 0.1 300)" }).code;

    expect(lightnessOf(modedAt(own, "keyword", "base"))).toBeCloseTo(0.2, 3);
  });

  it("raises an ink that stands the distance and still fails the text ratio on the page", () => {
    const side = { ink: "oklch(90% 0 0)", page: "oklch(45% 0 0)" };
    const own = coded({ dark: side, light: side }).code;
    const keyword = modedAt(own, "keyword", "_dark");

    expect(lightnessOf(keyword)).toBeGreaterThan(0.45 + 0.75 * 0.45);
    expect(contrast(keyword, side.page)).toBeGreaterThan(contrast("oklch(78.8% 0 0)", side.page));
  });

  it("draws every default ink at the text ratio on the foundation's pages", () => {
    const own = coded(FOUNDATION).code;

    for (const kind of ["keyword", "string", "number", "function", "type", "attr"]) {
      expect(contrast(modedAt(own, kind, "base"), PAGES.light)).toBeGreaterThanOrEqual(7);
      expect(contrast(modedAt(own, kind, "_dark"), PAGES.dark)).toBeGreaterThanOrEqual(7);
    }
  });
});
