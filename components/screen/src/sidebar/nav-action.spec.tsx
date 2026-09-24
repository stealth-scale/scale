import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { NavAction } from "#sidebar/nav-action.ts";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("NavAction", () => {
  it("renders a button inside a block", () => {
    const { container } = render(blocked(<NavAction>Add project</NavAction>));

    expect(slotElement(container, "sidebar", "navAction").tagName).toBe("BUTTON");
  });

  it("defaults type to button", () => {
    const { container } = render(blocked(<NavAction>Add project</NavAction>));

    expect(slotElement(container, "sidebar", "navAction").getAttribute("type")).toBe("button");
  });

  it("calls onClick on a press", async () => {
    let added = 0;
    render(
      blocked(
        <NavAction
          onClick={() => {
            added += 1;
          }}
        >
          Add project
        </NavAction>,
      ),
    );

    await pressed(screen.getByRole("button", { name: "Add project" }));

    expect(added).toBe(1);
  });
});
