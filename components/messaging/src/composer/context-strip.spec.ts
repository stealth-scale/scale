import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#composer/composer.fixtures.tsx";

describe("Context", () => {
  it("renders a DIV for the context slot", () => {
    const { container } = render(composed());

    expect(slotElement(container, "composer", "context").tagName).toBe("DIV");
  });
});
