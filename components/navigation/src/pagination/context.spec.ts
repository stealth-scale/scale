import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#pagination/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("nav", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "pagination", "root")).toContain("pagination__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("nav", "root");
    const Text = withContext("output", "pageText");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Text)));

    expect(slotClasses(container, "pagination", "pageText")).toContain(
      slotVariantClass("pagination", "pageText", "size", "lg"),
    );
  });
});
