import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#command/command.fixtures.tsx";
import { recipe } from "#command/recipe.ts";
import { type RootProps } from "#command/root.tsx";

/**
 * The props a case may override, excluding the two the fixture already supplies.
 */
type Settings = Omit<RootProps, "actions" | "aria-label">;

describe("Root", () => {
  it("reports no axe violation with every part composed", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div element for the root slot", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "root").tagName).toBe("DIV");
  });

  it("passes its aria-label down to the listbox", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Commands" })).toBeTruthy();
  });

  it("renders one option per action before any query is typed", () => {
    render(composed());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onRun with the value of the action that was chosen", async () => {
    const heard = vi.fn<(value: string) => void>();

    render(composed({ onRun: heard }));
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(heard).toHaveBeenCalledWith("invoices");
  });

  it("leaves aria-selected false on an option after it has been chosen", async () => {
    render(composed());
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });
});
