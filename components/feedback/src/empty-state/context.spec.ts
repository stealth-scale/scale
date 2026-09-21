import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#empty-state/context.ts";

describe("context", () => {
  it("applies the root slot class to an element bound with withProvider", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "empty-state", "root")).toContain("empty-state__root");
  });

  it("applies the size the provider resolved to a descendant slot", () => {
    const Root = withProvider("div", "root");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Root, { size: "lg" }, createElement(Title, null, "Nothing here")),
    );

    expect(slotClasses(container, "empty-state", "title")).toContain(
      slotVariantClass("empty-state", "title", "size", "lg"),
    );
  });
});
