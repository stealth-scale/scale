import { render, screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, composed } from "#code-block/code-block.fixtures.tsx";
import { Content, type ContentProps } from "#code-block/content.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Content", () => {
  it("satisfies the component contract with pre as its element", () => {
    expect(
      violations(Content, {
        children: true,
        element: "PRE",
        subject: (container) => slotElement(container, "code-block", "content"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Content />, props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("omits as from its props", () => {
    expectTypeOf<ContentProps>().not.toHaveProperty("as");
    expect(Content).toBeDefined();
  });

  it("renders the pre as the scroll area's content", () => {
    const { container } = render(coded(<Content />));

    expect(slotElement(container, "code-block", "content").className).toContain(
      "scroll-area__content",
    );
  });

  it("renders the pre inside the scroll area's viewport", () => {
    const { container } = render(coded(<Content />));

    expect(slotElement(container, "code-block", "content").parentElement).toBe(
      slotElement(container, "code-block", "viewport"),
    );
  });

  it("lets a long line grow past the viewport", () => {
    const { container } = render(coded(<Content />));

    expect(slotElement(container, "code-block", "content").className).toContain(
      "scroll-area__content--horizontal",
    );
  });

  it("scrolls the code sideways", () => {
    const { container } = render(coded(<Content />));

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["orientation"]).toBe(
      "horizontal",
    );
  });

  it("names the region by the title while one renders", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-labelledby")).toBe(
      screen.getByText("button.tsx").id,
    );
  });

  it("names the region by label without a title", () => {
    const { container } = render(coded(<Content label="Manifest" />));

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-label")).toBe(
      "Manifest",
    );
  });

  it("names the region Code by default", () => {
    const { container } = render(coded(<Content />));

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-label")).toBe(
      "Code",
    );
  });
});
