import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeElement } from "@stealthscale/testing-theme";

import { withContext } from "#format/context.ts";

describe("context", () => {
  it("applies the format class to a bound element", () => {
    const Figure = withContext("data");
    const { container } = render(createElement(Figure, { value: "1" }));

    expect([...recipeElement(container, "format").classList]).toContain("format");
  });
});
