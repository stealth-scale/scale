import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Content } from "#alert/content.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Content", () => {
  it("renders a div for the content slot", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").tagName).toBe("DIV");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("sets no role attribute on the element it renders", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").hasAttribute("role")).toBe(false);
  });
});
