import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#markdown/context.ts";

describe("context", () => {
  it("applies the root's slot class to the element it provides", () => {
    const Framed = withProvider("div", "root");
    const { container } = render(createElement(Framed));

    expect(slotClasses(container, "markdown", "root")).toContain(slotClass("markdown", "root"));
  });

  it("applies the root's size class to a part inside it", () => {
    const Framed = withProvider("div", "root");
    const Flowed = withContext("div", "flow");
    const { container } = render(createElement(Framed, { size: "sm" }, createElement(Flowed)));

    expect(slotClasses(container, "markdown", "flow")).toContain(
      slotVariantClass("markdown", "flow", "size", "sm"),
    );
  });
});
