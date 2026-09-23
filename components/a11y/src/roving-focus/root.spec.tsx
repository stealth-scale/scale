import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#roving-focus/item.tsx";
import { recipe } from "#roving-focus/recipe.ts";
import { Root } from "#roving-focus/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation as a toolbar with a button", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: { children: <Item as="button">Cut</Item>, role: "toolbar" },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
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

  it("renders a nav when as is nav", () => {
    const { container } = render(<Root as="nav" />);

    expect(slotElement(container, "roving-focus", "root").tagName).toBe("NAV");
  });
});
