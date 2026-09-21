import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#roving-focus/item.tsx";
import { recipe } from "#roving-focus/recipe.ts";
import { Root } from "#roving-focus/root.tsx";

describe("Root", () => {
  it("reports no axe violation as a toolbar containing a button", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: { children: <Item as="button">Cut</Item>, role: "toolbar" },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("sets aria-orientation when the caller supplies a role", () => {
    const { container } = render(<Root orientation="vertical" role="toolbar" />);

    expect(slotElement(container, "roving-focus", "root").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("omits aria-orientation when the caller supplies no role", () => {
    const { container } = render(<Root orientation="vertical" />);

    expect(
      slotElement(container, "roving-focus", "root").getAttribute("aria-orientation"),
    ).toBeNull();
  });

  it("omits aria-orientation when the orientation is both", () => {
    const { container } = render(<Root orientation="both" role="toolbar" />);

    expect(
      slotElement(container, "roving-focus", "root").getAttribute("aria-orientation"),
    ).toBeNull();
  });

  it("renders the root slot as nav when as is nav", () => {
    const { container } = render(<Root as="nav" />);

    expect(slotElement(container, "roving-focus", "root").tagName).toBe("NAV");
  });
});
