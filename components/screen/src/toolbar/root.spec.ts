import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#toolbar/recipe.ts";
import { composed, type Settings } from "#toolbar/toolbar.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding three bands of controls", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries the role that tells a reader the arrows move between the controls", () => {
    render(composed());

    expect(screen.getByRole("toolbar")).toBeTruthy();
  });

  it("names what the toolbar acts on", () => {
    render(composed());

    expect(screen.getByRole("toolbar", { name: "Invoice" })).toBeTruthy();
  });

  it("leaves one tab stop across the controls rather than one each", () => {
    render(composed());

    expect(screen.getAllByRole("button").filter((control) => control.tabIndex === 0)).toHaveLength(
      1,
    );
  });

  it("draws the row the recipe binds", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root")).toBeTruthy();
  });

  it("reports no narrowness in a document that measures nothing", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root").dataset["narrow"]).toBeUndefined();
  });
});
