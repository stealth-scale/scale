import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#composer/context.ts";

describe("context", () => {
  it("applies the size class to the input slot", () => {
    const Root = withProvider("form", "root");
    const Input = withContext("textarea", "input");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Input)));

    expect(slotClasses(container, "composer", "input")).toContain(
      variantClass("composer__input", "size", "lg"),
    );
  });
});
