import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#nav-list/nav-list.fixtures.tsx";
import { recipe } from "#nav-list/recipe.ts";
import { type RootProps } from "#nav-list/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding rows and a branch", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a list a screen reader counts the destinations of", () => {
    const { container } = render(composed());

    expect(slotElement(container, "nav-list", "root").tagName).toBe("UL");
  });

  it("carries no landmark of its own", () => {
    render(composed());

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("draws the landmark as names", () => {
    render(composed({ "aria-label": "Main", as: "nav" }));

    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
  });
});
