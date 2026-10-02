import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#composer/composer.fixtures.tsx";

describe("Attachments", () => {
  it("renders a DIV for the attachments slot", () => {
    const { container } = render(composed());

    expect(slotElement(container, "composer", "attachments").tagName).toBe("DIV");
  });
});
