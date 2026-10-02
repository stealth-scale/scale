import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#json-tree-view/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "json-tree-view", "root")).toContain("json-tree-view__root");
  });

  it("passes the root's size to the tree below it", () => {
    const Root = withProvider("div", "root");
    const Tree = withContext("div", "tree");
    const { container } = render(createElement(Root, { size: "md" }, createElement(Tree)));

    expect(slotClasses(container, "json-tree-view", "tree")).toContain(
      slotVariantClass("json-tree-view", "tree", "size", "md"),
    );
  });
});
