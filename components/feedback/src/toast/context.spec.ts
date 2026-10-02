import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#toast/context.ts";

describe("context", () => {
  it("applies the region's slot class to a bound element", () => {
    const Region = withProvider("div", "region");
    const { container } = render(createElement(Region));

    expect(slotClasses(container, "toast", "region")).toContain("toast__region");
  });

  it("applies a part's slot class below the region", () => {
    const Region = withProvider("div", "region");
    const Title = withContext("div", "title");
    const { container } = render(createElement(Region, {}, createElement(Title)));

    expect(slotClasses(container, "toast", "title")).toContain("toast__title");
  });
});
