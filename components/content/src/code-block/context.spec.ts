import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#code-block/context.ts";

describe("context", () => {
  it("applies the root slot class to the element withProvider wraps", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "code-block", "root")).toContain("code-block__root");
  });

  it("applies the root's size variant to a slot nested below it", () => {
    const Root = withProvider("div", "root");
    const Code = withContext("code", "code");
    const { container } = render(createElement(Root, { size: "sm" }, createElement(Code)));

    expect(slotClasses(container, "code-block", "code")).toContain(
      slotVariantClass("code-block", "code", "size", "sm"),
    );
  });
});
