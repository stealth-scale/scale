import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#steps/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "steps", "root")).toContain("steps__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Title = withContext("span", "title");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Title)));

    expect(slotClasses(container, "steps", "title")).toContain(
      slotVariantClass("steps", "title", "size", "lg"),
    );
  });
});
