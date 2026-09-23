import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Field } from "#input-group/field.ts";
import { composed, grouped } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.tsx";

describe("Field", () => {
  it("renders an input inside the root", () => {
    const { container } = render(grouped(<Field aria-label="Amount" />));

    expect(slotElement(container, "input-group", "field").tagName).toBe("INPUT");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "field",
      }),
    ).toStrictEqual([]);
  });

  it("carries no class of the input recipe", () => {
    const { container } = render(grouped(<Field aria-label="Amount" />));
    const classes = [...slotElement(container, "input-group", "field").classList];

    expect(classes.filter((name) => name === "input" || name.startsWith("input--"))).toStrictEqual(
      [],
    );
  });

  it("exposes the field by its accessible name", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: "Amount" })).toBeDefined();
  });

  it("renders the element that as names", () => {
    const { container } = render(grouped(<Field aria-label="Notes" as="textarea" />));

    expect(slotElement(container, "input-group", "field").tagName).toBe("TEXTAREA");
  });

  it("passes the size attribute through to the element", () => {
    render(grouped(<Field aria-label="Month" size={2} />));

    expect(screen.getByRole("textbox", { name: "Month" }).getAttribute("size")).toBe("2");
  });
});
