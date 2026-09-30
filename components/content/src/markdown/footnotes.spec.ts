import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";

const NOTED = "Kept.[^a] Purged.[^b]\n\n[^a]: By the officer.\n[^b]: Every night.\n";

describe("renderFootnotes", () => {
  it("renders a section with the recipe's footnotes class", () => {
    const { container } = rendered(NOTED);

    expect(slotElement(container, "markdown", "footnotes").tagName).toBe("SECTION");
  });

  it("labels the section by a heading one level below the document's top", () => {
    const { getByRole } = rendered(NOTED, { headingLevel: 2 });

    expect(getByRole("region", { name: "Footnotes" }).querySelector("h3")?.textContent).toBe(
      "Footnotes",
    );
  });

  it("renders the notes in a numbered list in reference order", () => {
    const { getByRole } = rendered(NOTED);
    const list = getByRole("region", { name: "Footnotes" }).querySelector("ol");

    expect(
      [...(list?.children ?? [])].map((item) => item.textContent?.replace(" ↩", "")),
    ).toStrictEqual(["By the officer.", "Every night."]);
  });

  it("renders a divider before the notes", () => {
    const { getByRole } = rendered(NOTED);

    expect(getByRole("region", { name: "Footnotes" }).firstElementChild?.tagName).toBe("HR");
  });

  it("labels the section in the caller's words", () => {
    const { getByRole } = rendered(NOTED, { footnotesLabel: "Voetnoten" });

    expect(getByRole("region", { name: "Voetnoten" }).tagName).toBe("SECTION");
  });
});
