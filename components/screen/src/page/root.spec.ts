import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#page/page.fixtures.tsx";
import { recipe } from "#page/recipe.ts";
import { type RootProps } from "#page/root.tsx";

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

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "page", "root").tagName).toBe("DIV");
  });

  it("sets no landmark role", () => {
    render(composed());

    expect(screen.queryByRole("main")).toBeNull();
  });

  it("sets no data-narrow where the document measures no width", () => {
    const { container } = render(composed());

    expect(slotElement(container, "page", "root").dataset["narrow"]).toBeUndefined();
  });
});
