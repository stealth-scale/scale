import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, OUTPUT, sgr, SOURCE } from "#code-block/code-block.fixtures.tsx";
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

/**
 * Collects the text and the attributes of every span in the code, in document order.
 *
 * @remarks
 *   The attributes are read from `attributes`, because happy-dom's `dataset` lists no attribute
 *   with an empty value.
 */
function runs(container: HTMLElement): Array<{ attributes: Record<string, string>; text: string }> {
  return Array.from(
    slotElement(container, "code-block", "code").querySelectorAll<HTMLElement>("span"),
    (span) => ({
      attributes: Object.fromEntries(
        Array.from(span.attributes, ({ name, value }) => [name, value]),
      ),
      text: span.textContent ?? "",
    }),
  );
}

/**
 * Collects the text of every text node directly inside the code, in document order.
 */
function texts(container: HTMLElement): string[] {
  return Array.from(slotElement(container, "code-block", "code").childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "");
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

  it("renders terminal output without its escapes when the language is ansi", () => {
    const { container } = render(coded(<Code />, { code: OUTPUT, language: "ansi" }));

    expect(slotElement(container, "code-block", "code").textContent).toBe("✓ payout 41ms\nfailed");
  });

  it("renders a span per styled run with its style as data attributes", () => {
    const { container } = render(coded(<Code />, { code: OUTPUT, language: "ansi" }));

    expect(runs(container)).toStrictEqual([
      { attributes: { "data-ansi": "green" }, text: "✓" },
      { attributes: { "data-dim": "" }, text: "41ms" },
      { attributes: { "data-ansi": "red", "data-bold": "" }, text: "failed" },
    ]);
  });

  it("sets data-underline on an underlined run", () => {
    const { container } = render(coded(<Code />, { code: `${sgr(4)}docs`, language: "ansi" }));

    expect(runs(container)).toStrictEqual([{ attributes: { "data-underline": "" }, text: "docs" }]);
  });

  it("renders a plain run of terminal output as a text node", () => {
    const { container } = render(coded(<Code />, { code: OUTPUT, language: "ansi" }));

    expect(texts(container)).toStrictEqual([" payout ", "\n"]);
  });

  it("renders markup in terminal output as text", () => {
    const { container } = render(
      coded(<Code />, { code: `${sgr(31)}<b>not bold</b>`, language: "ansi" }),
    );

    expect(container.querySelector("b")).toBeNull();
  });
});
