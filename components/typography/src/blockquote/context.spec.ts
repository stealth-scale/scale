import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#blockquote/context.ts";

describe("context", () => {
  it("applies the slot class to each bound part", () => {
    const Root = withProvider("div", "root");
    const Content = withContext("p", "content");
    const { container } = render(createElement(Root, null, createElement(Content, null, "Said")));

    expect(slotClasses(container, "blockquote", "root")).toContain("blockquote__root");
    expect(slotClasses(container, "blockquote", "content")).toContain("blockquote__content");
  });

  it("applies the variant set on the root to a part below it", () => {
    const Root = withProvider("div", "root");
    const Mark = withContext("span", "icon");
    const { container } = render(createElement(Root, { variant: "surface" }, createElement(Mark)));

    expect(slotClasses(container, "blockquote", "icon")).toContain(
      slotVariantClass("blockquote", "icon", "variant", "surface"),
    );
  });
});
