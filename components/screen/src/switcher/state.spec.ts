import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { inSidebar, inToolbar } from "#switcher/placed.fixtures.tsx";
import { chosen } from "#switcher/switcher.fixtures.tsx";

/**
 * Returns the classes of the switcher's trigger in a rendered tree.
 */
function classesOf(tree: React.ReactElement): readonly string[] {
  return slotClasses(render(tree).container, "switcher", "root");
}

describe("usePlaced", () => {
  it("places a switcher inside a sidebar as a row", () => {
    expect(classesOf(inSidebar())).toContain(
      variantClass("switcher__root", "placement", "sidebar"),
    );
  });

  it("gives a switcher inside a sidebar the sidebar's size", () => {
    expect(classesOf(inSidebar({ size: "lg" }))).toContain(
      variantClass("switcher__root", "size", "lg"),
    );
  });

  it("places a switcher inside a toolbar as a control", () => {
    expect(classesOf(inToolbar())).toContain(
      variantClass("switcher__root", "placement", "toolbar"),
    );
  });

  it("gives a switcher inside a toolbar the toolbar's size", () => {
    expect(classesOf(inToolbar("sm"))).toContain(variantClass("switcher__root", "size", "sm"));
  });

  it.each([
    { give: "xs", want: "sm" },
    { give: "xl", want: "lg" },
  ] as const)("gives a switcher in a $give toolbar the $want size", ({ give, want }) => {
    expect(classesOf(inToolbar(give))).toContain(variantClass("switcher__root", "size", want));
  });

  it("places a switcher elsewhere on its own at md", () => {
    expect(classesOf(chosen())).toStrictEqual(
      expect.arrayContaining([
        variantClass("switcher__root", "placement", "alone"),
        variantClass("switcher__root", "size", "md"),
      ]),
    );
  });

  it("applies the caller's placement over the sidebar's", () => {
    expect(classesOf(inSidebar({}, { placement: "alone" }))).toContain(
      variantClass("switcher__root", "placement", "alone"),
    );
  });

  it("applies the caller's size over the sidebar's", () => {
    expect(classesOf(inSidebar({ size: "lg" }, { size: "sm" }))).toContain(
      variantClass("switcher__root", "size", "sm"),
    );
  });

  it("applies the caller's size over the toolbar's", () => {
    expect(classesOf(inToolbar("sm", { size: "lg" }))).toContain(
      variantClass("switcher__root", "size", "lg"),
    );
  });

  it("places a switcher with a toolbar placement outside a toolbar at md", () => {
    expect(classesOf(chosen({ placement: "toolbar" }))).toContain(
      variantClass("switcher__root", "size", "md"),
    );
  });

  it("places a switcher with a sidebar placement outside a sidebar at md", () => {
    expect(classesOf(chosen({ placement: "sidebar" }))).toContain(
      variantClass("switcher__root", "size", "md"),
    );
  });
});
