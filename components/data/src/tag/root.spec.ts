import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#tag/recipe.ts";
import { Root, type RootProps } from "#tag/root.ts";
import { composed } from "#tag/tag.fixtures.tsx";

describe("Root", () => {
  it("returns no conformance violation for its SPAN root", () => {
    expect(violations(Root, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a complete tag", async () => {
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

    expect(slotElement(container, "tag", "root").className).toContain(
      variantClass("tag__root", "palette", "error"),
    );
  });
});
