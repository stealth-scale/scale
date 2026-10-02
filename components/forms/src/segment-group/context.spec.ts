import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#segment-group/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Track = withProvider("div", "root");
    const Segment = withContext("label", "item");
    const { container } = render(createElement(Track, null, createElement(Segment)));

    expect(slotClasses(container, "segment-group", "item")).toContain(
      slotClass("segment-group", "item"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Track = withProvider("div", "root");
    const Segment = withContext("label", "item");
    const { container } = render(
      createElement(Track, { variant: "solid" }, createElement(Segment)),
    );

    expect(slotClasses(container, "segment-group", "item")).toContain(
      variantClass(slotClass("segment-group", "item"), "variant", "solid"),
    );
  });
});
