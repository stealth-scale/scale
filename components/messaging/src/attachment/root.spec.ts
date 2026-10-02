import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { filed, grouped } from "#attachment/attachment.fixtures.tsx";
import { recipe } from "#attachment/recipe.ts";
import { Root, type RootProps } from "#attachment/root.tsx";

/**
 * Returns the class of the first attachment's root.
 */
function rootClass(container: HTMLElement): string {
  return slotElement(container, "attachment", "root").className;
}

describe("Root", () => {
  it("returns no conformance violation for its DIV root", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a group of attachments", async () => {
    await expect(accessibilityViolations(() => grouped())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(filed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div outside a group", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "root").tagName).toBe("DIV");
  });

  it("renders a list item inside a group", () => {
    render(grouped());

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("writes data-state as done unless stated", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "root").dataset["state"]).toBe("done");
  });

  it("writes data-state from state", () => {
    const { container } = render(filed({ state: "error" }));

    expect(slotElement(container, "attachment", "root").dataset["state"]).toBe("error");
  });

  it("takes the group's size and orientation", () => {
    const { container } = render(grouped({ orientation: "vertical", size: "sm" }));

    expect([
      rootClass(container).includes(variantClass("attachment__root", "size", "sm")),
      rootClass(container).includes(variantClass("attachment__root", "orientation", "vertical")),
    ]).toStrictEqual([true, true]);
  });

  it("keeps its own size and orientation inside a group", () => {
    const { container } = render(
      grouped({ orientation: "vertical", size: "sm" }, { orientation: "horizontal", size: "xs" }),
    );

    expect([
      rootClass(container).includes(variantClass("attachment__root", "size", "xs")),
      rootClass(container).includes(variantClass("attachment__root", "orientation", "horizontal")),
    ]).toStrictEqual([true, true]);
  });

  it("takes the recipe's defaults inside a group that states none", () => {
    const { container } = render(grouped());

    expect(rootClass(container)).toContain(variantClass("attachment__root", "size", "md"));
  });
});
