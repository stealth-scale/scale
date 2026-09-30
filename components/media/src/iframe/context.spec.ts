import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClass, recipeElement } from "@stealthscale/testing-theme";

import { withContext } from "#iframe/context.ts";

describe("context", () => {
  it("applies the recipe's class to an element bound with withContext", () => {
    const Drawn = withContext("iframe");
    const { container } = render(createElement(Drawn, { title: "Preview" }));

    expect(recipeElement(container, "iframe").className).toContain(recipeClass("iframe"));
  });
});
