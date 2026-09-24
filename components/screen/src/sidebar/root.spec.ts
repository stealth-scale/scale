import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#sidebar/recipe.ts";
import { type RootProps } from "#sidebar/root.tsx";
import { composed } from "#sidebar/sidebar.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a whole sidebar", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").tagName).toBe("DIV");
  });

  it("renders no landmark of its own", () => {
    render(composed());

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("omits data-iconic when iconic is not passed", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBeUndefined();
  });

  it("writes data-iconic when iconic is passed", () => {
    const { container } = render(composed({ iconic: true }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBe("");
  });
});
