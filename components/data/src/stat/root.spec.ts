import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#stat/recipe.ts";
import { Root, type RootProps } from "#stat/root.ts";
import { composed } from "#stat/stat.fixtures.tsx";

describe("Root", () => {
  it("returns no conformance violation for its DL root", () => {
    expect(violations(Root, { as: true, children: true, element: "DL" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a complete stat", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("applies the palette class passed as palette", () => {
    const { container } = render(composed({ palette: "error" }));

    expect(slotElement(container, "stat", "root").className).toContain(
      variantClass("stat__root", "palette", "error"),
    );
  });
});
