import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#editable/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grid = withProvider("div", "root");
    const Shown = withContext("span", "preview");
    const { container } = render(createElement(Grid, null, createElement(Shown)));

    expect(slotClasses(container, "editable", "preview")).toContain(
      slotClass("editable", "preview"),
    );
  });

  it("applies the root's size to a part inside it", () => {
    const Grid = withProvider("div", "root");
    const Shown = withContext("span", "preview");
    const { container } = render(createElement(Grid, { size: "lg" }, createElement(Shown)));

    expect(slotClasses(container, "editable", "preview")).toContain(
      variantClass(slotClass("editable", "preview"), "size", "lg"),
    );
  });
});
