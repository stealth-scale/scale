import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#page/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Columned = withProvider("div", "root");
    const Banded = withContext("header", "header");
    const { container } = render(createElement(Columned, null, createElement(Banded)));

    expect(slotClasses(container, "page", "header")).toContain(slotClass("page", "header"));
  });

  it("passes the root's variants to a band below it", () => {
    const Columned = withProvider("div", "root");
    const Banded = withContext("header", "header");
    const { container } = render(createElement(Columned, { size: "lg" }, createElement(Banded)));

    expect(slotClasses(container, "page", "header")).toContain(
      variantClass(slotClass("page", "header"), "size", "lg"),
    );
  });
});
