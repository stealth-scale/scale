import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#stat/recipe.ts";
import { type RootProps } from "#stat/root.ts";
import { composed, stated } from "#stat/stat.fixtures.tsx";
import { ValueText } from "#stat/value-text.ts";

describe("ValueText", () => {
  it("renders a DD for the figure slot", () => {
    const { container } = render(stated(<ValueText>240</ValueText>));

    expect(slotElement(container, "stat", "valueText").tagName).toBe("DD");
  });

  it("emits a class for every size value on the figure slot", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "valueText",
      }),
    ).toStrictEqual([]);
  });
});
