import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#listbox/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Framed = withProvider("div", "root");
    const Listed = withContext("ul", "content");
    const { container } = render(createElement(Framed, null, createElement(Listed)));

    expect(slotClasses(container, "listbox", "content")).toContain(slotClass("listbox", "content"));
  });

  it("applies the root's variant class to a row inside it", () => {
    const Framed = withProvider("div", "root");
    const Offered = withContext("li", "item");
    const { container } = render(
      createElement(Framed, { highlight: "bar" }, createElement(Offered)),
    );

    expect(slotClasses(container, "listbox", "item")).toContain(
      variantClass(slotClass("listbox", "item"), "highlight", "bar"),
    );
  });
});
