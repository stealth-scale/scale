import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#slider/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grid = withProvider("div", "root");
    const Handle = withContext("div", "thumb");
    const { container } = render(createElement(Grid, null, createElement(Handle)));

    expect(slotClasses(container, "slider", "thumb")).toContain(slotClass("slider", "thumb"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Grid = withProvider("div", "root");
    const Handle = withContext("div", "thumb");
    const { container } = render(createElement(Grid, { variant: "subtle" }, createElement(Handle)));

    expect(slotClasses(container, "slider", "thumb")).toContain(
      variantClass(slotClass("slider", "thumb"), "variant", "subtle"),
    );
  });
});
