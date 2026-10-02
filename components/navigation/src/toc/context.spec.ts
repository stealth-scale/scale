import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#toc/context.ts";

describe("context", () => {
  it("applies the root slot class to an element bound with withProvider", () => {
    const Root = withProvider("nav", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "toc", "root")).toContain("toc__root");
  });

  it("applies a variant set on the root to a part bound with withContext", () => {
    const Root = withProvider("nav", "root");
    const Link = withContext("a", "link");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Link)));

    expect(slotClasses(container, "toc", "link")).toContain(
      slotVariantClass("toc", "link", "size", "lg"),
    );
  });
});
