import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#alert/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Box = withProvider("div", "root");
    const Band = withContext("div", "content");
    const { container } = render(createElement(Box, null, createElement(Band, null, "a word")));

    expect(slotClasses(container, "alert", "content")).toContain("alert__content");
  });

  it("applies the size class passed to an element bound with withProvider", () => {
    const Box = withProvider("div", "root");
    const Band = withContext("div", "content");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Band, null, "a word")),
    );

    expect(slotClasses(container, "alert", "root")).toContain(
      variantClass("alert__root", "size", "lg"),
    );
  });
});
