import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#timeline/recipe.ts";
import { Root, type RootProps } from "#timeline/root.ts";
import { composed } from "#timeline/timeline.fixtures.tsx";

describe("Root", () => {
  it("returns no conformance violation for its OL root", () => {
    expect(violations(Root, { as: true, children: true, element: "OL" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a complete timeline", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a centred rail", async () => {
    await expect(
      accessibilityViolations(() => composed({ rail: "center" })),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("applies the rail class passed as rail", () => {
    const { container } = render(composed({ rail: "end" }));

    expect(slotElement(container, "timeline", "root").className).toContain(
      variantClass("timeline__root", "rail", "end"),
    );
  });

  it("renders its entries as a list", () => {
    render(composed());

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
