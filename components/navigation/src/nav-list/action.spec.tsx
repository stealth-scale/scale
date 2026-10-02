import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#nav-list/action.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Action", () => {
  it("renders a BUTTON element inside a list", () => {
    const { container } = render(listed(<Action aria-label="Rename Invoices">R</Action>));

    expect(slotElement(container, "nav-list", "action").tagName).toBe("BUTTON");
  });

  it("sets type to button when the caller passes none", () => {
    render(listed(<Action aria-label="Rename Invoices">R</Action>));

    expect(screen.getByRole("button", { name: "Rename Invoices" }).getAttribute("type")).toBe(
      "button",
    );
  });

  it("returns no accessibility violation when it has an aria-label", async () => {
    await expect(
      accessibilityViolations(() =>
        listed(
          <li>
            <Action aria-label="Rename Invoices">
              <svg aria-hidden="true" />
            </Action>
          </li>,
        ),
      ),
    ).resolves.toStrictEqual([]);
  });
});
