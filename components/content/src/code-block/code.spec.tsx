import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { Code } from "#code-block/code.tsx";
import { recipe } from "#code-block/recipe.ts";

/**
 * Reads the kind of every token the passage drew, in order.
 */
function kinds(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-token]"),
    (token) => token.dataset["token"] ?? "",
  );
}

describe("Code", () => {
  it("conforms as a code element inside the panel it needs above it", () => {
    expect(
      violations(Code, {
        as: true,
        element: "CODE",
        subject: (container) => slotElement(container, "code-block", "code"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(accessibilityViolations(Code, { wrapper: coded })).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Code />, props)).container, {
        slot: "code",
      }),
    ).toStrictEqual([]);
  });

  it("sets the whole passage as written", () => {
    const { container } = render(coded(<Code />));

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("draws each token that has a kind in a span carrying it", () => {
    const { container } = render(coded(<Code />));

    expect(kinds(container)).toStrictEqual(["keyword", "type", "keyword", "string"]);
  });

  it("draws a language it does not know as plain text", () => {
    const { container } = render(coded(<Code />, { language: "brainfuck" }));

    expect(kinds(container)).toStrictEqual([]);
    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("draws plain text where no language is named", () => {
    const { container } = render(coded(<Code />, { language: undefined }));

    expect(kinds(container)).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(coded(<Code as="span" />));

    expect(slotElement(container, "code-block", "code").tagName).toBe("SPAN");
  });
});
