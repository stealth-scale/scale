import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Addon } from "#input-group/addon.tsx";
import { Field } from "#input-group/field.ts";
import { grouped } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.tsx";

describe("Addon", () => {
  it("renders a div inside the root", () => {
    const { container } = render(grouped(<Addon>https://</Addon>));

    expect(slotElement(container, "input-group", "addon").tagName).toBe("DIV");
  });

  it("writes filled to data-look by default", () => {
    const { container } = render(grouped(<Addon>https://</Addon>));

    expect(slotElement(container, "input-group", "addon").dataset["look"]).toBe("filled");
  });

  it("writes the look passed as look to data-look", () => {
    const { container } = render(grouped(<Addon look="plain">https://</Addon>));

    expect(slotElement(container, "input-group", "addon").dataset["look"]).toBe("plain");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) =>
          render(
            grouped(
              <>
                <Addon>https://</Addon>
                <Field aria-label="Site" />
              </>,
              props,
            ),
          ).container,
        { slot: "addon" },
      ),
    ).toStrictEqual([]);
  });
});
