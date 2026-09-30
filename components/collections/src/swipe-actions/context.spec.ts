import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#swipe-actions/context.ts";

describe("context", () => {
  it("applies the root's slot class to the element it provides", () => {
    const Framed = withProvider("div", "root");
    const { container } = render(createElement(Framed));

    expect(slotClasses(container, "swipe-actions", "root")).toContain(
      slotClass("swipe-actions", "root"),
    );
  });

  it("applies the slot class to an element it binds", () => {
    const Framed = withProvider("div", "root");
    const Moving = withContext("div", "content");
    const { container } = render(createElement(Framed, null, createElement(Moving)));

    expect(slotClasses(container, "swipe-actions", "content")).toContain(
      slotClass("swipe-actions", "content"),
    );
  });
});
