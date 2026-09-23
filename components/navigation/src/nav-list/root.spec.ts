import { createElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#nav-list/nav-list.fixtures.tsx";
import { recipe } from "#nav-list/recipe.ts";
import { type RootProps } from "#nav-list/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a list with rows and a branch", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a UL element", () => {
    const { container } = render(composed());

    expect(slotElement(container, "nav-list", "root").tagName).toBe("UL");
  });

  it("renders no navigation landmark", () => {
    render(composed());

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("renders an OL element when as is set to ol", () => {
    const { container } = render(composed({ as: "ol" }));

    expect(slotElement(container, "nav-list", "root").tagName).toBe("OL");
  });

  it("returns no accessibility violation inside a nav the caller renders", async () => {
    await expect(
      accessibilityViolations(() => createElement("nav", { "aria-label": "Main" }, composed())),
    ).resolves.toStrictEqual([]);
  });
});
