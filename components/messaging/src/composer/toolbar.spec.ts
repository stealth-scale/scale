import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#composer/composer.fixtures.tsx";

describe("Toolbar", () => {
  it("renders a DIV for the toolbar slot", () => {
    const { container } = render(composed());

    expect(slotElement(container, "composer", "toolbar").tagName).toBe("DIV");
  });
});
