import { describe, expect, it } from "vitest";

import { splitMenuVariants } from "#menu/variants.ts";

describe("splitMenuVariants", () => {
  it("returns the recipe's axes first", () => {
    const [picked] = splitMenuVariants({ highlight: "bar", size: "sm" });

    expect(picked).toStrictEqual({ highlight: "bar", size: "sm" });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitMenuVariants({ className: "wide", size: "sm" });

    expect(rest).toStrictEqual({ className: "wide" });
  });

  it("picks every axis of the recipe", () => {
    const [picked] = splitMenuVariants({
      highlight: "fill",
      inset: true,
      palette: "info",
      size: "lg",
      variant: "glass",
    });

    expect(Object.keys(picked).toSorted()).toStrictEqual([
      "highlight",
      "inset",
      "palette",
      "size",
      "variant",
    ]);
  });

  it("returns no axes for props without one", () => {
    const [picked, rest] = splitMenuVariants({ children: "Rename" });

    expect(picked).toStrictEqual({});
    expect(rest).toStrictEqual({ children: "Rename" });
  });
});
