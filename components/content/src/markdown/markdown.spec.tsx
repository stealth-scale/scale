import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { everything, rendered } from "#markdown/markdown.fixtures.tsx";
import { Markdown } from "#markdown/markdown.tsx";

describe("Markdown", () => {
  it("returns no accessibility violation for a document that uses every construct", async () => {
    await expect(accessibilityViolations(() => everything())).resolves.toStrictEqual([]);
  });

  it("renders a div with the recipe's root class", () => {
    const { container } = rendered("Hello.");

    expect(slotElement(container, "markdown", "root").tagName).toBe("DIV");
  });

  it("renders an empty root for an empty source", () => {
    const { container } = rendered("");

    expect(slotElement(container, "markdown", "root").childElementCount).toBe(0);
  });

  it("renders raw HTML as its text and no element", () => {
    const { container } = rendered("<script>alert(1)</script>\n");

    expect([container.querySelector("script"), container.textContent]).toStrictEqual([
      null,
      "<script>alert(1)</script>",
    ]);
  });

  it("drops a link with an executable destination and keeps its words", () => {
    const { container } = rendered("[Pay now](javascript:alert(1))\n");

    expect([container.querySelector("a"), container.textContent]).toStrictEqual([null, "Pay now"]);
  });

  it("writes aria-busy on the root while streaming", () => {
    const { container } = render(<Markdown source="The quarter closed" streaming />);

    expect(slotElement(container, "markdown", "root").getAttribute("aria-busy")).toBe("true");
  });

  it("leaves aria-busy off unless streaming", () => {
    const { container } = rendered("The quarter closed.");

    expect(slotElement(container, "markdown", "root").hasAttribute("aria-busy")).toBe(false);
  });

  it("passes the props of a div to the root", () => {
    const { container } = rendered("Hello.", { title: "Policy" });

    expect(slotElement(container, "markdown", "root").title).toBe("Policy");
  });

  it("renders the text of a source that changes", () => {
    const { container, rerender } = render(<Markdown source="First." />);

    rerender(<Markdown source="Second." />);

    expect(container.textContent).toBe("Second.");
  });

  it("gives the footnotes of two documents on one page different ids", () => {
    const { container } = render(
      <>
        <Markdown source={"One.[^a]\n\n[^a]: Note.\n"} />
        <Markdown source={"Two.[^a]\n\n[^a]: Note.\n"} />
      </>,
    );
    const ids = [...container.querySelectorAll("li[id]")].map((item) => item.id);

    expect(new Set(ids).size).toBe(2);
  });
});
