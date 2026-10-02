import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#app-shell/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Columned = withProvider("div", "root");
    const Barred = withContext("header", "header");
    const { container } = render(createElement(Columned, null, createElement(Barred)));

    expect(slotClasses(container, "app-shell", "header")).toContain(
      slotClass("app-shell", "header"),
    );
  });

  it("applies the root's variant to a part below it", () => {
    const Columned = withProvider("div", "root");
    const Framed = withContext("main", "main");
    const { container } = render(
      createElement(Columned, { variant: "inset" }, createElement(Framed)),
    );

    expect(slotClasses(container, "app-shell", "main")).toContain(
      variantClass(slotClass("app-shell", "main"), "variant", "inset"),
    );
  });
});
