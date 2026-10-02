import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Indicator } from "#status/indicator.ts";
import { recipe } from "#status/recipe.ts";
import { Root, type RootProps } from "#status/root.ts";

describe("Root", () => {
  it("returns no conformance violation for its SPAN root", () => {
    expect(violations(Root, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation inside a paragraph", async () => {
    await expect(
      accessibilityViolations(() => (
        <p>
          Payouts are{" "}
          <Root palette="success">
            <Indicator />
            Live
          </Root>
        </p>
      )),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) =>
          render(
            <Root {...props}>
              <Indicator />
              Live
            </Root>,
          ).container,
        { slot: "root" },
      ),
    ).toStrictEqual([]);
  });

  it("applies the palette class passed as palette", () => {
    const { container } = render(<Root palette="error">Down</Root>);

    expect(slotElement(container, "status", "root").className).toContain(
      variantClass("status__root", "palette", "error"),
    );
  });
});
