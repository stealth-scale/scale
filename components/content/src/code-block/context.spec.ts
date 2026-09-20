import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#code-block/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "code-block", "root")).toContain("code-block__root");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Code = withContext("code", "code");
    const { container } = render(createElement(Root, { size: "sm" }, createElement(Code)));

    expect(slotClasses(container, "code-block", "code")).toContain(
      slotVariantClass("code-block", "code", "size", "sm"),
    );
  });
});
