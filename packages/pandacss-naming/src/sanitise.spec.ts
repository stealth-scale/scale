import { describe, expect, it } from "vitest";

import { kebab, sanitise } from "#sanitise.ts";

describe("sanitise", () => {
  it.each([
    { give: "grid-ar-{sizes.32}", want: "grid-ar-sizes-32" },
    { give: "grid-ar-token(sizes.32)", want: "grid-ar-token-sizes-32" },
    { give: "ff-Segoe_UI,_sans-serif", want: "ff-Segoe-UI-sans-serif" },
    { give: "grid-tc-repeat(3,_minmax(0,_1fr))", want: "grid-tc-repeat-3-minmax-0-1fr" },
    { give: "w-calc(100%_-_2rem)", want: "w-calc-100%-2rem" },
    { give: "mt--1.5rem", want: "mt--1-5rem" },
    { give: "layerStyle-dim.others", want: "layerStyle-dim-others" },
  ])("rewrites $give as $want", ({ give, want }) => {
    expect(sanitise(give)).toBe(want);
  });

  it.each(["m--4", "w-50%", "h-1/2", "p-4!", "card__content--bleed", "button--lg", "2xl"])(
    "keeps %s as written",
    (given) => {
      expect(sanitise(given)).toBe(given);
    },
  );

  it("drops the hyphen a run leaves before an importance mark", () => {
    expect(sanitise("w-calc(1px)!")).toBe("w-calc-1px!");
  });

  it("drops a leading run of the characters a stylesheet would escape", () => {
    expect(sanitise("{sizes.32}")).toBe("sizes-32");
    expect(sanitise("_x")).toBe("x");
    expect(sanitise("-4")).toBe("-4");
  });

  it("keeps the case of a value", () => {
    expect(sanitise("ff-Inter_Tight")).toBe("ff-Inter-Tight");
  });

  it("replaces a single underscore while keeping the two-underscore slot separator", () => {
    expect(sanitise("card__content_body")).toBe("card__content-body");
  });

  it("rewrites a camel-case name as kebab-case", () => {
    expect(kebab("focusVisible")).toBe("focus-visible");
    expect(kebab("smDown")).toBe("sm-down");
    expect(kebab("2xl")).toBe("2xl");
  });
});
