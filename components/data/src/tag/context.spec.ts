import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#tag/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("span", "root");
    const Label = withContext("span", "label");
    const { container } = render(createElement(Root, null, createElement(Label, null, "payouts")));

    expect(slotClasses(container, "tag", "label")).toContain("tag__label");
  });

  it("applies the default variant class to the root", () => {
    const Root = withProvider("span", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "tag", "root")).toContain(
      variantClass("tag__root", "variant", "surface"),
    );
  });
});
