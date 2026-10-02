import { type BlockNode, type MarkdownDocument } from "@tanstack/markdown";
import { describe, expect, it } from "vitest";

import { rendered } from "#markdown/markdown.fixtures.tsx";

function noted(blocks: BlockNode[]): MarkdownDocument {
  return {
    children: [
      {
        children: [
          { type: "text", value: "Kept." },
          { id: "a", number: 1, type: "footnoteReference" },
        ],
        type: "paragraph",
      },
      { items: [{ children: blocks, id: "a", number: 1 }], type: "footnotes" },
    ],
    type: "root",
  };
}

describe("renderNote", () => {
  it("links back to the reference by the footnote's number", () => {
    const { getByRole } = rendered("Kept.[^a]\n\n[^a]: By the officer.\n");
    const back = getByRole("link", { name: "Back to reference 1" });
    const reference = document.querySelector(`[id="${back.getAttribute("href")?.slice(1) ?? ""}"]`);

    expect(reference?.textContent).toBe("1");
  });

  it("links back to each reference to a footnote", () => {
    const { getAllByRole } = rendered("One.[^a] Two.[^a]\n\n[^a]: Shared.\n");

    expect(
      getAllByRole("link", { name: /^Back to reference/u }).map((link) =>
        link.getAttribute("aria-label"),
      ),
    ).toStrictEqual(["Back to reference 1", "Back to reference 1-2"]);
  });

  it("appends the back links to the note's last paragraph", () => {
    const { getByRole } = rendered("Kept.[^a]\n\n[^a]: By the officer.\n");

    expect(getByRole("link", { name: "Back to reference 1" }).parentElement?.textContent).toBe(
      "By the officer. ↩",
    );
  });

  it("renders the note's earlier blocks before its last paragraph", () => {
    const { getByRole } = rendered(
      noted([
        { children: [{ type: "text", value: "First." }], type: "paragraph" },
        { children: [{ type: "text", value: "Second." }], type: "paragraph" },
      ]),
    );
    const note = getByRole("link", { name: "Back to reference 1" }).closest("li");

    expect(
      [...(note?.querySelectorAll("p") ?? [])].map((paragraph) => paragraph.textContent),
    ).toStrictEqual(["First.", "Second. ↩"]);
  });

  it("renders the back links in a line after a note that ends with a list", () => {
    const { getByRole } = rendered(
      noted([
        {
          items: [
            {
              children: [{ children: [{ type: "text", value: "one" }], type: "paragraph" }],
              type: "listItem",
            },
          ],
          ordered: false,
          type: "list",
        },
      ]),
    );
    const back = getByRole("link", { name: "Back to reference 1" });

    expect([back.closest("ul"), back.parentElement?.tagName]).toStrictEqual([null, "P"]);
  });

  it("renders the note in the xs text size of an sm document", () => {
    const { getByRole } = rendered("Kept.[^a]\n\n[^a]: By the officer.\n", { size: "sm" });

    expect(getByRole("link", { name: "Back to reference 1" }).parentElement?.className).toContain(
      "text--xs",
    );
  });

  it("renders the note in the sm text size of an md document", () => {
    const { getByRole } = rendered("Kept.[^a]\n\n[^a]: By the officer.\n");

    expect(getByRole("link", { name: "Back to reference 1" }).parentElement?.className).toContain(
      "text--sm",
    );
  });

  it("names the back links in the caller's words", () => {
    const { getByRole } = rendered("Kept.[^a]\n\n[^a]: By the officer.\n", {
      footnoteBackLabel: (number) => `Terug naar verwijzing ${String(number)}`,
    });

    expect(getByRole("link", { name: "Terug naar verwijzing 1" }).textContent).toBe("↩");
  });
});
