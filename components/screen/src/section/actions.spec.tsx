import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Action } from "#section/action.tsx";
import { Actions } from "#section/actions.tsx";
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

  it("renders no menu on a wide section", () => {
    render(
      blocked(
        <Actions>
          <Action>Contact</Action>
        </Actions>,
      ),
    );

    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("renders the menu's trigger on a narrow section with a tertiary action", () => {
    render(
      narrowed(
        blocked(
          <Actions more="More billing actions">
            <Action>Contact</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.getByRole("button", { name: "More billing actions" })).toBeTruthy();
  });

  it("renders the trigger at the actions' size", () => {
    render(
      narrowed(
        blocked(
          <Actions>
            <Action>Contact</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.getByRole("button", { name: "More actions" }).classList).toContain(
      variantClass("button", "size", "sm"),
    );
  });

  it("runs a folded action's onClick from its menu row", async () => {
    const onClick = vi.fn<() => void>();

    await drawn(
      narrowed(
        blocked(
          <Actions>
            <Action onClick={onClick}>Contact</Action>
          </Actions>,
        ),
      ),
    );
    await pressed(screen.getByRole("button", { name: "More actions" }));
    await pressed(screen.getByRole("menuitem", { name: "Contact" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
