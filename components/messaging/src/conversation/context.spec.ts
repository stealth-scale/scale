import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#conversation/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Typing = withContext("div", "typing");
    const { container } = render(createElement(Root, null, createElement(Typing)));

    expect(slotClasses(container, "conversation", "typing")).toContain("conversation__typing");
  });
});
