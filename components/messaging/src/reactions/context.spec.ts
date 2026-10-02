import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#reactions/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("fieldset", "root");
    const Count = withContext("span", "count");
    const { container } = render(createElement(Root, null, createElement(Count)));

    expect(slotClasses(container, "reactions", "count")).toContain("reactions__count");
  });
});
