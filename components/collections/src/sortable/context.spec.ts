import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#sortable/context.ts";

describe("context", () => {
  it("applies the root's slot class to the element it provides", () => {
    const Framed = withProvider("div", "root");
    const { container } = render(createElement(Framed));

    expect(slotClasses(container, "sortable", "root")).toContain(slotClass("sortable", "root"));
  });

  it("applies the slot class to an element it binds", () => {
    const Framed = withProvider("div", "root");
    const Listed = withContext("ul", "items");
    const { container } = render(createElement(Framed, null, createElement(Listed)));

    expect(slotClasses(container, "sortable", "items")).toContain(slotClass("sortable", "items"));
  });
});
