import { createElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { composed } from "#nav-list/nav-list.fixtures.tsx";
import { PropsProvider } from "#nav-list/props-provider.tsx";
import { recipe } from "#nav-list/recipe.ts";
import { type RootProps } from "#nav-list/root.tsx";

/**
 * Reads the root's classes.
 */
function classesOf(container: HTMLElement): readonly string[] {
  return [...slotElement(container, "nav-list", "root").classList];
}

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

  it("takes iconic from the props provider", () => {
    const { container } = render(
      <PropsProvider value={{ iconic: true }}>{composed()}</PropsProvider>,
    );

    expect(classesOf(container)).toContain(variantClass("nav-list__root", "iconic", "true"));
  });

  it("prefers its own iconic over the props provider", () => {
    const { container } = render(
      <PropsProvider value={{ iconic: true }}>{composed({ iconic: false })}</PropsProvider>,
    );

    expect(classesOf(container)).not.toContain(variantClass("nav-list__root", "iconic", "true"));
  });

  it("takes size from the props provider", () => {
    const { container } = render(
      <PropsProvider value={{ size: "lg" }}>{composed()}</PropsProvider>,
    );

    expect(classesOf(container)).toContain(variantClass("nav-list__root", "size", "lg"));
  });
});
