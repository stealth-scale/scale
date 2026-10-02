import { describe, expect, it } from "vitest";

import { type CompilerConfig } from "#recipe.ts";
import { rename } from "#rename.ts";

const CONFIG: CompilerConfig = {
  recipes: [
    { axes: ["loading", "size"], className: "button" },
    { axes: ["size"], className: "button-group" },
    { axes: ["bleed", "size"], className: "card", slots: ["content", "root"] },
  ],
  separator: "-",
};

describe("rename", () => {
  it("rewrites a string variant as the class and the value", () => {
    expect(rename("button--size-lg", CONFIG)).toBe("button--lg");
  });

  it("rewrites a boolean variant at true as the class and the axis", () => {
    expect(rename("button--loading-true", CONFIG)).toBe("button--loading");
  });

  it("returns an empty string for a boolean variant at false", () => {
    expect(rename("button--loading-false", CONFIG)).toBe("");
  });

  it("rewrites a variant on a slot", () => {
    expect(rename("card__content--bleed-true", CONFIG)).toBe("card__content--bleed");
    expect(rename("card__root--size-sm", CONFIG)).toBe("card__root--sm");
  });

  it("keeps a value that contains the separator whole", () => {
    expect(rename("button--size-extra-large", CONFIG)).toBe("button--extra-large");
  });

  it("returns a recipe's base class unchanged", () => {
    expect(rename("button", CONFIG)).toBe("button");
    expect(rename("card__root", CONFIG)).toBe("card__root");
  });

  it("returns a compound's class unchanged", () => {
    expect(rename("button--expose", CONFIG)).toBe("button--expose");
  });

  it("rewrites a variant of a recipe whose class starts with another recipe's class", () => {
    expect(rename("button-group--size-lg", CONFIG)).toBe("button-group--lg");
  });

  it.each([
    ["on", "on-off"],
    ["on-off", "on"],
  ])("matches the longest axis when the axes are declared as %s then %s", (...axes) => {
    const config: CompilerConfig = { recipes: [{ axes, className: "card" }], separator: "-" };

    expect(rename("card--on-off-true", config)).toBe("card--on-off");
    expect(rename("card--on-true", config)).toBe("card--on");
  });

  it("rewrites an atomic class no recipe owns", () => {
    expect(rename("md:grid-tc-repeat(3,_minmax(0,_1fr))", CONFIG)).toBe(
      "md:grid-tc-repeat-3-minmax-0-1fr",
    );
  });

  it("splits a variant at the separator the compiler was configured with", () => {
    expect(rename("button--size_lg", { ...CONFIG, separator: "_" })).toBe("button--lg");
    expect(rename("button--size=lg", { ...CONFIG, separator: "=" })).toBe("button--lg");
  });

  it("returns a class unchanged when no recipe owns it and it holds no separator", () => {
    expect(rename("childBox", CONFIG)).toBe("childBox");
    expect(rename("prose", CONFIG)).toBe("prose");
    expect(rename("md:childBox", CONFIG)).toBe("md:childBox");
  });

  it("rewrites a slot named in camel case into kebab case", () => {
    const config: CompilerConfig = {
      recipes: [{ axes: ["size"], className: "card", slots: ["iconBox"] }],
      separator: "-",
    };

    expect(rename("card__iconBox", config)).toBe("card__icon-box");
    expect(rename("card__iconBox--size-sm", config)).toBe("card__icon-box--sm");
  });
});
