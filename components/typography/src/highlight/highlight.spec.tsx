import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { Highlight } from "#highlight/highlight.tsx";

const SENTENCE = "The offer was raised, and the offer settled.";

function marks(container: HTMLElement): string[] {
  return [...container.querySelectorAll("mark")].map((mark) => mark.textContent);
}

describe("Highlight", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => (
        <p>
          <Highlight query="offer">{SENTENCE}</Highlight>
        </p>
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders the text as it is", () => {
    const { container } = render(<Highlight query="offer">{SENTENCE}</Highlight>);

    expect(container.textContent).toBe(SENTENCE);
  });

  it("renders every match in a mark", () => {
    const { container } = render(<Highlight query="offer">{SENTENCE}</Highlight>);

    expect(marks(container)).toStrictEqual(["offer", "offer"]);
  });

  it("renders no mark when nothing matches", () => {
    const { container } = render(<Highlight query="refund">{SENTENCE}</Highlight>);

    expect(marks(container)).toStrictEqual([]);
  });

  it("passes the mark props to every mark", () => {
    const { container } = render(
      <Highlight palette="success" query="offer">
        {SENTENCE}
      </Highlight>,
    );
    const palettes = [...container.querySelectorAll("mark")].map((mark) =>
      mark.classList.contains(variantClass("mark", "palette", "success")),
    );

    expect(palettes).toStrictEqual([true, true]);
  });

  it("renders every match at the none inset when inset is absent", () => {
    const { container } = render(<Highlight query="offer">{SENTENCE}</Highlight>);
    const insets = [...container.querySelectorAll("mark")].map((mark) =>
      mark.classList.contains(variantClass("mark", "inset", "none")),
    );

    expect(insets).toStrictEqual([true, true]);
  });

  it("renders every match at the inset passed as inset", () => {
    const { container } = render(
      <Highlight inset="xs" query="offer">
        {SENTENCE}
      </Highlight>,
    );
    const insets = [...container.querySelectorAll("mark")].map((mark) =>
      mark.classList.contains(variantClass("mark", "inset", "xs")),
    );

    expect(insets).toStrictEqual([true, true]);
  });

  it("ignores letter case when ignoreCase is absent", () => {
    const { container } = render(<Highlight query="the">{SENTENCE}</Highlight>);

    expect(marks(container)).toStrictEqual(["The", "the"]);
  });

  it("matches letter case when ignoreCase is false", () => {
    const { container } = render(
      <Highlight ignoreCase={false} query="the">
        {SENTENCE}
      </Highlight>,
    );

    expect(marks(container)).toStrictEqual(["the"]);
  });
});
