import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import {
  boundViolations,
  slotClass,
  slotClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { Root as PageRoot } from "#page/root.tsx";
import { Body } from "#section/body.ts";
import { recipe } from "#section/recipe.ts";
import { type RootProps } from "#section/root.tsx";
import { blocked, composed } from "#section/section.fixtures.tsx";

describe("Root", () => {
  it("passes axe with every band", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a section", () => {
    const { container } = render(composed());

    expect(slotElement(container, "section", "root").tagName).toBe("SECTION");
  });

  it("sets role region named by its title", () => {
    render(composed());

    expect(screen.getByRole("region", { name: "Billing" })).toBeTruthy();
  });

  it("has no name without a title", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(screen.queryByRole("region", { name: /./u })).toBeNull();
    expect(slotElement(container, "section", "root").getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("takes its size from its page", () => {
    const { container } = render(<PageRoot size="lg">{composed()}</PageRoot>);

    expect(slotClasses(container, "section", "title")).toContain(
      variantClass(slotClass("section", "title"), "size", "lg"),
    );
  });

  it("keeps its own size inside a page", () => {
    const { container } = render(<PageRoot size="lg">{composed({ size: "sm" })}</PageRoot>);

    expect(slotClasses(container, "section", "title")).toContain(
      variantClass(slotClass("section", "title"), "size", "sm"),
    );
  });

  it("sets no data-narrow where the document measures no width", () => {
    const { container } = render(composed());

    expect(slotElement(container, "section", "root").dataset["narrow"]).toBeUndefined();
  });
});
