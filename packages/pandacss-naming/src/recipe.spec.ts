import { describe, expect, it } from "vitest";

import { compoundClass, slotClass, variantClass } from "#recipe.ts";

describe("recipe", () => {
  it("writes a string variant as the class and the value", () => {
    expect(variantClass("button", "size", "lg")).toBe("button--lg");
  });

  it("writes a numeric variant as the class and the number", () => {
    expect(variantClass("stack", "gap", 4)).toBe("stack--4");
  });

  it("writes a boolean variant at true as the class and the axis", () => {
    expect(variantClass("button", "loading", true)).toBe("button--loading");
    expect(variantClass("button", "loading", "true")).toBe("button--loading");
  });

  it("returns an empty string for a boolean variant at false", () => {
    expect(variantClass("button", "loading", false)).toBe("");
    expect(variantClass("button", "loading", "false")).toBe("");
  });

  it("writes a camel-case axis and value as kebab-case", () => {
    expect(variantClass("card", "bleedEdges", true)).toBe("card--bleed-edges");
    expect(variantClass("button", "size", "extraLarge")).toBe("button--extra-large");
  });

  it("writes a variant class from a slot's class", () => {
    expect(variantClass(slotClass("card", "content"), "bleed", true)).toBe("card__content--bleed");
  });

  it("writes a slot's class from the class name and the slot", () => {
    expect(slotClass("card", "root")).toBe("card__root");
    expect(slotClass("card", "contentBody")).toBe("card__content-body");
  });

  it("writes a compound's class from the name the recipe declared", () => {
    expect(compoundClass("button", "expose")).toBe("button--expose");
    expect(compoundClass("card", "exposeAll")).toBe("card--expose-all");
  });
});
