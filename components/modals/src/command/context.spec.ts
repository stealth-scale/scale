import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#command/context.ts";

describe("context", () => {
  it("applies the control slot class to the element withContext wraps", () => {
    const Panelled = withProvider("div", "root");
    const Banded = withContext("div", "control");
    const { container } = render(createElement(Panelled, null, createElement(Banded)));

    expect(slotClasses(container, "command", "control")).toContain(slotClass("command", "control"));
  });

  it("applies the root's size variant to a slot nested below it", () => {
    const Panelled = withProvider("div", "root");
    const Banded = withContext("div", "control");
    const { container } = render(createElement(Panelled, { size: "lg" }, createElement(Banded)));

    expect(slotClasses(container, "command", "control")).toContain(
      variantClass(slotClass("command", "control"), "size", "lg"),
    );
  });
});
