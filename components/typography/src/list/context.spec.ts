import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#list/context.ts";

describe("context", () => {
  it("applies the slot class to each bound part", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("span", "item");
    const { container } = render(createElement(Root, null, createElement(Item, null, "One")));

    expect(slotClasses(container, "list", "root")).toContain("list__root");
    expect(slotClasses(container, "list", "item")).toContain("list__item");
  });

  it("applies the variant set on the root to a part below it", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("span", "item");
    const { container } = render(
      createElement(Root, { variant: "plain" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "list", "item")).toContain(
      slotVariantClass("list", "item", "variant", "plain"),
    );
  });
});
