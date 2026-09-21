import { describe, expect, it } from "vitest";

import { atomicClass, conditionsOf } from "#atomic.ts";

describe("atomic", () => {
  it.each([
    { give: "layerStyle-dim.others", want: "layer-style-dim-others" },
    { give: "textStyle-body.md", want: "text-style-body-md" },
    { give: "md:grid-tc-repeat(3,_minmax(0,_1fr))", want: "md:grid-tc-repeat-3-minmax-0-1fr" },
    { give: "grid-ar-{sizes.32}", want: "grid-ar-sizes-32" },
    { give: "focusVisible:c-red", want: "focus-visible:c-red" },
    { give: "hover:dark:c-pink", want: "hover:dark:c-pink" },
    { give: "2xl:c-blue", want: "2xl:c-blue" },
    { give: "wide:child:gap-3", want: "wide:child:gap-3" },
    { give: "ff-Segoe_UI,_sans-serif", want: "ff-segoe-ui-sans-serif" },
    { give: "m--4", want: "m--4" },
    { give: "mt--1.5rem", want: "mt--1-5rem" },
    { give: "p-4!", want: "p-4!" },
  ])("rewrites $give as $want under the hyphen separator", ({ give, want }) => {
    expect(atomicClass(give, "-")).toBe(want);
  });

  it.each([
    { give: "layerStyle_dim.others", want: "layer-style-dim-others" },
    { give: "md:grid-tc_repeat(3,_minmax(0,_1fr))", want: "md:grid-tc-repeat-3-minmax-0-1fr" },
    { give: "grid-ar_{sizes.32}", want: "grid-ar-sizes-32" },
    { give: "focusVisible:c_red", want: "focus-visible:c-red" },
    { give: "ff_Segoe_UI,_sans-serif", want: "ff-segoe-ui-sans-serif" },
    { give: "bg_colorPalette.solid", want: "bg-color-palette-solid" },
    { give: "bx-sh-c_colorPalette.solid/50", want: "bx-sh-c-color-palette-solid/50" },
    { give: "--stagger_0", want: "stagger-0" },
    { give: "--meteor-travel_{sizes.96}", want: "meteor-travel-sizes-96" },
    { give: "m_-4", want: "m--4" },
    { give: "m_4", want: "m-4" },
    { give: "mt_-1.5rem", want: "mt--1-5rem" },
    { give: "w_50%", want: "w-50%" },
    { give: "p_4!", want: "p-4!" },
  ])("rewrites $give as $want under the underscore separator", ({ give, want }) => {
    expect(atomicClass(give, "_")).toBe(want);
  });

  it("splits the utility from its value at the equals separator", () => {
    expect(atomicClass("grid-ar={sizes.32}", "=")).toBe("grid-ar-sizes-32");
  });

  it("keeps a raw selector condition as written", () => {
    expect(atomicClass("[&_>_*]:c-red", "-")).toBe("[&_>_*]:c-red");
  });

  it("keeps a raw at-rule condition with a colon inside its brackets as written", () => {
    expect(atomicClass("[@media_(min-width:_40rem)]:c-green", "-")).toBe(
      "[@media_(min-width:_40rem)]:c-green",
    );
  });

  it("rewrites the utility of a class whose condition is raw", () => {
    expect(atomicClass("[&_>_*]:grid-ar_{sizes.32}", "_")).toBe("[&_>_*]:grid-ar-sizes-32");
  });

  it("returns a class the scheme wrote unchanged", () => {
    expect(atomicClass("card__content--bleed", "_")).toBe("card__content--bleed");
    expect(atomicClass("button--lg", "-")).toBe("button--lg");
  });

  it("rewrites a camel-case slot name as kebab-case", () => {
    expect(atomicClass("card__contentBody", "_")).toBe("card__content-body");
    expect(atomicClass("card__contentBody--lg", "-")).toBe("card__content-body--lg");
  });

  it("returns an empty string when the class is empty", () => {
    expect(atomicClass("", "_")).toBe("");
  });

  it("returns each condition of a class from the outermost inward", () => {
    expect(conditionsOf("md:[@media_(min-width:_40rem)]:c-green")).toStrictEqual([
      "md",
      "[@media_(min-width:_40rem)]",
    ]);
  });

  it("returns an empty array when the class declares no condition", () => {
    expect(conditionsOf("c-red")).toStrictEqual([]);
  });
});
