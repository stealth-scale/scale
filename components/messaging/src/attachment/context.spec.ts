import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#attachment/context.ts";

describe("context", () => {
  it("applies the size class to the title slot", () => {
    const Root = withProvider("div", "root");
    const Title = withContext("span", "title");
    const { container } = render(createElement(Root, { size: "sm" }, createElement(Title)));

    expect(slotClasses(container, "attachment", "title")).toContain(
      variantClass("attachment__title", "size", "sm"),
    );
  });
});
