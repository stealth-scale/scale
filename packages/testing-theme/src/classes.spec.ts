import { describe, expect, it } from "vitest";

import { compoundClass, recipeClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";

describe("classes", () => {
  it("returns the class name unchanged as the base class", () => {
    expect(recipeClass("button")).toBe("button");
  });

  it("returns the class name and the value for a string variant", () => {
    expect(variantClass("button", "variant", "solid")).toBe("button--solid");
  });

  it("returns the axis for a boolean variant at true and an empty string at false", () => {
    expect(variantClass("button", "loading", true)).toBe("button--loading");
    expect(variantClass("button", "loading", false)).toBe("");
  });

  it("returns the class name and the number for a numeric variant", () => {
    expect(variantClass("stack", "gap", 4)).toBe("stack--4");
  });

  it("returns the class name and the slot for a slot", () => {
    expect(slotClass("dialog", "content")).toBe("dialog__content");
  });

  it("returns the value appended to the slot class for a slot variant", () => {
    expect(slotVariantClass("dialog", "content", "size", "lg")).toBe("dialog__content--lg");
  });

  it("returns the class name and the compound name for a compound", () => {
    expect(compoundClass("button", "hero")).toBe("button--hero");
  });
});
