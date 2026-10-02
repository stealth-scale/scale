import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { inNarrowToolbar, inSidebar, inToolbar } from "#switcher/placed.fixtures.tsx";
import { recipe } from "#switcher/recipe.ts";
import { type RootProps } from "#switcher/root.tsx";
import { composed, triggered } from "#switcher/switcher.fixtures.tsx";

describe("Trigger", () => {
  it("returns no accessibility violation for an open switcher", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(triggered(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a button", () => {
    const { container } = render(triggered());

    expect(slotElement(container, "switcher", "root").tagName).toBe("BUTTON");
  });

  it("starts its accessible name with the label", () => {
    render(triggered());

    expect(screen.getByRole("button", { name: "Workspace Acme Pro plan" })).toBeTruthy();
  });

  it("sets no aria-label", () => {
    render(triggered());

    expect(screen.getByRole("button").getAttribute("aria-label")).toBeNull();
  });

  it("sets aria-expanded to true while the menu is open", async () => {
    await drawn(composed());

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("writes data-iconic on a rail", () => {
    render(inSidebar({ iconic: true }));

    expect(screen.getByRole("button").dataset["iconic"]).toBe("");
  });

  it("omits data-iconic in a sidebar in full", () => {
    render(inSidebar());

    expect(screen.getByRole("button").dataset["iconic"]).toBeUndefined();
  });

  it("writes data-narrow in a narrow toolbar", () => {
    render(inNarrowToolbar());

    expect(screen.getByRole("button", { name: /^Workspace/u }).dataset["narrow"]).toBe("");
  });

  it("omits data-narrow in a wide toolbar", () => {
    render(inToolbar());

    expect(screen.getByRole("button", { name: /^Workspace/u }).dataset["narrow"]).toBeUndefined();
  });
});
