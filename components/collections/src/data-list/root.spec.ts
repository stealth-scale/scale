import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { composed } from "#data-list/data-list.fixtures.tsx";
import { recipe } from "#data-list/recipe.ts";
import { Root, type RootProps } from "#data-list/root.ts";

describe("Root", () => {
  it("returns no conformance violation for its DL root", () => {
    expect(violations(Root, { as: true, children: true, element: "DL" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a complete list", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a list across the page", async () => {
    await expect(
      accessibilityViolations(() => composed({ orientation: "horizontal" })),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("applies the orientation class passed as orientation", () => {
    const { container } = render(composed({ orientation: "horizontal" }));

    expect(slotElement(container, "data-list", "root").className).toContain(
      variantClass("data-list__root", "orientation", "horizontal"),
    );
  });
});
