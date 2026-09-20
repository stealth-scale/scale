import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses } from "@stealthscale/testing-theme";

import { recipe } from "#room/recipe.ts";
import { Room } from "#room/room.ts";

describe("Room", () => {
  it("conforms as a div element", () => {
    expect(violations(Room, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Room, { props: { children: "Draft" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Room {...props}>Draft</Room>).container),
    ).toStrictEqual([]);
  });

  it("holds what it is given", () => {
    const { container } = render(<Room>Draft</Room>);

    expect(container.textContent).toBe("Draft");
    expect(recipeClasses(container, "room")).toContain("room");
  });
});
