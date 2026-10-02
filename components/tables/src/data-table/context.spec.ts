import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#data-table/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Indicator = withContext("span", "sortIndicator");
    const { container } = render(createElement(Root, null, createElement(Indicator)));

    expect(slotClasses(container, "data-table", "sortIndicator")).toContain(
      "data-table__sort-indicator",
    );
  });
});
