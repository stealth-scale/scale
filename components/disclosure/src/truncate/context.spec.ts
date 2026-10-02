import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeElement } from "@stealthscale/testing-theme";

import { withContext } from "#truncate/context.ts";

describe("context", () => {
  it("applies the truncate class to a bound element", () => {
    const Text = withContext("span");
    const { container } = render(createElement(Text, null, "Rotterdam"));

    expect([...recipeElement(container, "truncate").classList]).toContain("truncate");
  });
});
