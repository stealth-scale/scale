import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { Code } from "#code-block/code.tsx";
import { recipe } from "#code-block/recipe.ts";

/**
 * Collects the kind of every highlighted token, in document order.
 */
function kinds(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-token]"),
    (token) => token.dataset["token"] ?? "",
  );
}

describe("Code", () => {
  it("satisfies the component contract with code as its default element", () => {
    expect(
      violations(Code, {
        as: true,
        element: "CODE",
        subject: (container) => slotElement(container, "code-block", "code"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("reports no axe violation when rendered inside a root", async () => {
    await expect(accessibilityViolations(Code, { wrapper: coded })).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Code />, props)).container, {
        slot: "code",
      }),
    ).toStrictEqual([]);
  });

  it("renders the root's code unchanged as its text content", () => {
    const { container } = render(coded(<Code />));

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("sets data-token on each span to the kind the highlighter assigned", () => {
    const { container } = render(coded(<Code />));

    expect(kinds(container)).toStrictEqual(["keyword", "type", "keyword", "string"]);
  });

  it("emits no token span when the language is one the highlighter does not know", () => {
    const { container } = render(coded(<Code />, { language: "brainfuck" }));

    expect(kinds(container)).toStrictEqual([]);
  });

  it("renders the code unchanged when the language is one the highlighter does not know", () => {
    const { container } = render(coded(<Code />, { language: "brainfuck" }));

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("emits no token span when no language is set", () => {
    const { container } = render(coded(<Code />, { language: undefined }));

    expect(kinds(container)).toStrictEqual([]);
  });

  it("renders the code slot as span when as is span", () => {
    const { container } = render(coded(<Code as="span" />));

    expect(slotElement(container, "code-block", "code").tagName).toBe("SPAN");
  });
});
