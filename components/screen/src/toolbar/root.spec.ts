import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#toolbar/recipe.ts";
import { composed, type Settings } from "#toolbar/toolbar.fixtures.tsx";

describe("Root", () => {
  it("passes axe with three bands", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("sets role toolbar", () => {
    render(composed());

    expect(screen.getByRole("toolbar")).toBeTruthy();
  });

  it("takes its name from aria-label", () => {
    render(composed());

    expect(screen.getByRole("toolbar", { name: "Invoice" })).toBeTruthy();
  });

  it("leaves one tab stop across the controls", () => {
    render(composed());

    expect(screen.getAllByRole("button").filter((control) => control.tabIndex === 0)).toHaveLength(
      1,
    );
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root")).toBeTruthy();
  });

  it("sets no data-narrow where the document measures no width", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root").dataset["narrow"]).toBeUndefined();
  });
});
