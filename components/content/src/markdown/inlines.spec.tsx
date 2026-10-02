import { parseMarkdown } from "@tanstack/markdown/parser";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";
import { type MarkdownImageProps, type MarkdownLinkProps } from "#markdown/scope.ts";

function RouterLink({ children, href }: MarkdownLinkProps): React.ReactElement {
  return (
    <a data-router="" href={href}>
      {children}
    </a>
  );
}

function CdnImage({ alt, src }: MarkdownImageProps): React.ReactElement {
  return <img alt={alt} src={`https://cdn.example.com${src}`} />;
}

describe("renderInlines", () => {
  it("renders strong text in a strong element", () => {
    const { getByText } = rendered("Kept **30 days**.\n");

    expect(getByText("30 days").tagName).toBe("STRONG");
  });

  it("renders emphasised text in an em element", () => {
    const { getByText } = rendered("Then *purged*.\n");

    expect(getByText("purged").tagName).toBe("EM");
  });

  it("renders code in a line in a code element", () => {
    const { getByText } = rendered("Run `purge()`.\n");

    expect(getByText("purge()").tagName).toBe("CODE");
  });

  it("renders struck text in a del with the recipe's deleted class", () => {
    const { container } = rendered("Old ~~60~~ days.\n");

    expect(slotElement(container, "markdown", "deleted").tagName).toBe("DEL");
  });

  it("renders a link with its destination and title", () => {
    const { getByRole } = rendered('[runbook](https://example.com/run "Runbook")\n');
    const link = getByRole("link", { name: "runbook" });

    expect([link.getAttribute("href"), link.title]).toStrictEqual([
      "https://example.com/run",
      "Runbook",
    ]);
  });

  it("renders a link through the caller's replacement", () => {
    const { getByRole } = rendered("[Invoices](/invoices)\n", {
      components: { link: RouterLink },
    });

    expect(getByRole("link", { name: "Invoices" }).dataset["router"]).toBe("");
  });

  it("renders an image lazily with its alternative text", () => {
    const { getByRole } = rendered("![Pipeline](/pipeline.png)\n");

    expect(getByRole("img", { name: "Pipeline" }).getAttribute("loading")).toBe("lazy");
  });

  it("renders an image through the caller's replacement", () => {
    const { getByRole } = rendered("![Pipeline](/pipeline.png)\n", {
      components: { image: CdnImage },
    });

    expect(getByRole("img", { name: "Pipeline" }).getAttribute("src")).toBe(
      "https://cdn.example.com/pipeline.png",
    );
  });

  it("renders the alternative text of an image whose source the URL policy removed", () => {
    const { container } = rendered("![Tracking pixel](javascript:alert(1))\n");

    expect([container.querySelector("img"), container.textContent]).toStrictEqual([
      null,
      "Tracking pixel",
    ]);
  });

  it("renders a hard break as a br", () => {
    const { container } = rendered("One\\\nTwo\n");

    expect(container.querySelector("p > br")).not.toBeNull();
  });

  it("renders nothing for inline HTML of a document parsed with HTML", () => {
    const { container } = rendered(parseMarkdown("a <b>bold</b> b\n", { allowHtml: true }));

    expect([container.querySelector("b"), container.textContent]).toStrictEqual([null, "a bold b"]);
  });

  it("renders the words inside an inline component", () => {
    const { container } = rendered({
      children: [
        {
          children: [
            {
              attributes: {},
              children: [{ type: "text", value: "npm" }],
              name: "Kbd",
              type: "inlineComponent",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "root",
    });

    expect(container.textContent).toBe("npm");
  });

  it("links a footnote reference to its footnote", () => {
    const { container } = rendered("Set.[^1]\n\n[^1]: By the officer.\n");
    const link = slotElement(container, "markdown", "reference").querySelector("a");
    const target = container.querySelector(`[id="${link?.getAttribute("href")?.slice(1) ?? ""}"]`);

    expect(target?.textContent).toContain("By the officer.");
  });

  it("describes a footnote reference by the footnotes' heading", () => {
    const { container } = rendered("Set.[^1]\n\n[^1]: By the officer.\n");
    const link = slotElement(container, "markdown", "reference").querySelector("a");
    const id = link?.getAttribute("aria-describedby") ?? "";

    expect(container.querySelector(`[id="${id}"]`)?.textContent).toBe("Footnotes");
  });
});
