import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Action } from "#section/action.tsx";
import { Actions } from "#section/actions.tsx";
import { blocked } from "#section/section.fixtures.tsx";

/**
 * Renders an empty `svg` in place of an icon.
 */
const ICON = <svg aria-hidden="true" />;

describe("Action", () => {
  it("renders a button", () => {
    const { container } = render(blocked(<Action primary>Change plan</Action>));

    expect(slotElement(container, "section", "action").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(blocked(<Action primary>Change plan</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("sets data-priority to tertiary for an action without an icon", () => {
    render(blocked(<Action>Contact</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("tertiary");
  });

  it("sets data-priority to secondary for an action with an icon", () => {
    render(blocked(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("secondary");
  });

  it("sets data-priority to its stated priority", () => {
    render(
      blocked(
        <Action icon={ICON} priority="tertiary">
          Contact
        </Action>,
      ),
    );

    expect(screen.getByRole("button").dataset["priority"]).toBe("tertiary");
  });

  it("renders solid when primary", () => {
    render(blocked(<Action primary>Change plan</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "solid"),
    );
  });

  it("renders outline when not primary", () => {
    render(blocked(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "outline"),
    );
  });

  it("renders one size smaller than the section", () => {
    render(blocked(<Action primary>Change plan</Action>, { size: "lg" }));

    expect(screen.getByRole("button").classList).toContain(variantClass("button", "size", "md"));
  });

  it("renders nothing for a tertiary action on a narrow section", () => {
    render(
      narrowed(
        blocked(
          <Actions>
            <Action>Contact</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "Contact" })).toBeNull();
  });

  it("writes data-narrow on a narrow section", () => {
    render(narrowed(blocked(<Action icon={ICON}>Download</Action>)));

    expect(screen.getByRole("button").dataset["narrow"]).toBe("");
  });

  it("omits data-narrow on a wide section", () => {
    render(blocked(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").dataset["narrow"]).toBeUndefined();
  });

  it("renders another control passed as as without the button's look", () => {
    render(
      blocked(
        <Action as="span" primary>
          Plans
        </Action>,
      ),
    );

    expect(screen.getByText("Plans").classList).not.toContain(
      variantClass("button", "variant", "solid"),
    );
  });
});
