import { parseMarkdown } from "@tanstack/markdown/parser";
import { describe, expect, it } from "vitest";

import { rendered } from "#markdown/markdown.fixtures.tsx";

describe("renderBlocks", () => {
  it("renders a heading at its depth with the parser's id", () => {
    const { getByRole } = rendered("## Install\n");

    expect(getByRole("heading", { level: 2, name: "Install" }).id).toBe("install");
  });

  it("renders a # heading at headingLevel", () => {
    const { getByRole } = rendered("# Follow-up\n", { headingLevel: 3 });

    expect(getByRole("heading", { name: "Follow-up" }).tagName).toBe("H3");
  });

  it("renders a paragraph as a p", () => {
    const { getByText } = rendered("Exports are kept.\n");

    expect(getByText("Exports are kept.").tagName).toBe("P");
  });

  it("renders a quotation's paragraphs inside a blockquote", () => {
    const { getByText } = rendered("> Data stays in the EU.\n");

    expect(getByText("Data stays in the EU.").closest("blockquote")).not.toBeNull();
  });

  it("renders a thematic break as a separator", () => {
    const { getByRole } = rendered("One.\n\n---\n\nTwo.\n");

    expect(getByRole("separator").tagName).toBe("HR");
  });

  it("renders nothing for an HTML block of a document parsed with HTML", () => {
    const { container } = rendered(parseMarkdown("<div>raw</div>\n", { allowHtml: true }));

    expect(container.textContent).toBe("");
  });

  it("renders the blocks inside a block of an extension", () => {
    const { container } = rendered({
      children: [
        {
          attributes: {},
          children: [{ children: [{ type: "text", value: "Inside." }], type: "paragraph" }],
          name: "Tabs",
          type: "component",
        },
      ],
      type: "root",
    });

    expect(container.querySelector("p")?.textContent).toBe("Inside.");
  });
});
