import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Root", () => {
  it("renders a table", () => {
    const { container } = render(scrolled(<Root />));

    expect(slotElement(container, "table", "root").tagName).toBe("TABLE");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("names the table from its caption", () => {
    render(composed());

    expect(screen.getByRole("table", { name: "Invoices this quarter" })).toBeDefined();
  });

  it("applies the fixed layout class with layout fixed", () => {
    const { container } = render(composed({ layout: "fixed" }));

    expect([...slotElement(container, "table", "root").classList].join(" ")).toContain("fixed");
  });
});
