import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Content } from "#alert/content.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Content", () => {
  it("renders a div", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").tagName).toBe("DIV");
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("sets no role", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").hasAttribute("role")).toBe(false);
  });
});
