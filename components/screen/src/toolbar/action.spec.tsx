import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#toolbar/action.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Action", () => {
  it("renders a button", () => {
    const { container } = render(ranged(<Action>Filter</Action>));

    expect(slotElement(container, "toolbar", "action").tagName).toBe("BUTTON");
  });

  it("takes the row's roving tab stop", () => {
    render(ranged(<Action>Filter</Action>));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("defaults data-priority to primary", () => {
    const { container } = render(ranged(<Action>Filter</Action>));

    expect(slotElement(container, "toolbar", "action").dataset["priority"]).toBe("primary");
  });

  it("sets data-priority to its priority", () => {
    const { container } = render(ranged(<Action priority="tertiary">Export</Action>));

    expect(slotElement(container, "toolbar", "action").dataset["priority"]).toBe("tertiary");
  });

  it("leaves one tab stop in a row of several controls", () => {
    render(
      ranged(
        <>
          <Action>Filter</Action>
          <Action priority="secondary">Sort</Action>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").filter((each) => each.tabIndex === 0)).toHaveLength(1);
  });
});
