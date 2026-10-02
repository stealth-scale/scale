import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#popover/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "popover", "root")).toContain("popover__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Title = withContext("h2", "title");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Title)));

    expect(slotClasses(container, "popover", "title")).toContain(
      slotVariantClass("popover", "title", "size", "lg"),
    );
  });
});
