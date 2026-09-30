import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#progress/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Track = withContext("div", "track");
    const { container } = render(createElement(Root, null, createElement(Track)));

    expect(slotClasses(container, "progress", "track")).toContain("progress__track");
  });

  it("applies the size class to the track slot", () => {
    const Root = withProvider("div", "root");
    const Track = withContext("div", "track");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Track)));

    expect(slotClasses(container, "progress", "track")).toContain(
      variantClass("progress__track", "size", "lg"),
    );
  });
});
