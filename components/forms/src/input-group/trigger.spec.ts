import { describe, expect, it } from "vitest";

import { trigger, triggerSide, triggerSizes } from "#input-group/trigger.ts";

describe("trigger", () => {
  it("styles an interactive button with an outside focus ring", () => {
    expect(trigger()).toMatchObject({ cursor: "button", focusVisibleRing: "outside" });
  });

  it("fills the button with bg.muted on hover", () => {
    expect(trigger()).toMatchObject({ _hover: { background: "bg.muted", color: "fg" } });
  });

  it("fills the button with bg.emphasized while pressed", () => {
    expect(trigger()).toMatchObject({ _active: { background: "bg.emphasized" } });
  });

  it("keeps a disabled button transparent on hover", () => {
    expect(trigger()).toMatchObject({
      _disabled: { _hover: { background: "transparent", color: "fg.muted" } },
    });
  });

  it("writes one square per control size", () => {
    expect(Object.keys(triggerSizes()).toSorted()).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("sizes the md square to the tag height with a 24px floor", () => {
    expect(triggerSizes().md).toStrictEqual({
      boxSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it("returns the side the size axis gives the square", () => {
    expect(triggerSide("lg")).toBe(triggerSizes().lg["boxSize"]);
  });
});
