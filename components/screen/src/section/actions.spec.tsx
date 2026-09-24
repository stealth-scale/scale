import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Actions } from "#section/actions.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Actions", () => {
  it("renders a div", () => {
    const { container } = render(blocked(<Actions>controls</Actions>));

    expect(slotElement(container, "section", "actions").tagName).toBe("DIV");
  });

  it("renders its controls", () => {
    render(
      blocked(
        <Actions>
          <button type="button">Change plan</button>
        </Actions>,
      ),
    );

    expect(screen.getByRole("button", { name: "Change plan" })).toBeTruthy();
  });
});
