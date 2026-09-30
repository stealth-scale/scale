import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClass, recipeElement } from "@stealthscale/testing-theme";

import { withContext } from "#audio/context.ts";

describe("context", () => {
  it("applies the recipe's class to an element bound with withContext", () => {
    const Drawn = withContext("audio");
    const { container } = render(createElement(Drawn));

    expect(recipeElement(container, "audio").className).toContain(recipeClass("audio"));
  });
});
