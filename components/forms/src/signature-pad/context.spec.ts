import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#signature-pad/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grouped = withProvider("div", "root");
    const Drawn = withContext("div", "control");
    const { container } = render(createElement(Grouped, null, createElement(Drawn)));

    expect(slotClasses(container, "signature-pad", "control")).toContain(
      slotClass("signature-pad", "control"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Grouped = withProvider("div", "root");
    const Drawn = withContext("div", "control");
    const { container } = render(
      createElement(Grouped, { variant: "subtle" }, createElement(Drawn)),
    );

    expect(slotClasses(container, "signature-pad", "control")).toContain(
      variantClass(slotClass("signature-pad", "control"), "variant", "subtle"),
    );
  });
});
