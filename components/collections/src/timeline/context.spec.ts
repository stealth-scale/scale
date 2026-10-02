import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#timeline/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("ol", "root");
    const Item = withContext("li", "item");
    const { container } = render(createElement(Root, null, createElement(Item)));

    expect(slotClasses(container, "timeline", "item")).toContain("timeline__item");
  });

  it("applies the size class to the title slot", () => {
    const Root = withProvider("ol", "root");
    const Title = withContext("div", "title");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Title)));

    expect(slotClasses(container, "timeline", "title")).toContain(
      variantClass("timeline__title", "size", "lg"),
    );
  });
});
