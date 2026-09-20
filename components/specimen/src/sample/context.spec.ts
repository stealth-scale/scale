import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#sample/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "sample", "root")).toContain("sample__root");
  });

  it("hands the look down to the body below the root", () => {
    const Root = withProvider("div", "root");
    const Body = withContext("div", "body");
    const { container } = render(
      createElement(Root, { variant: "outline" }, createElement(Body, null, "One")),
    );

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "variant", "outline"),
    );
  });
});
