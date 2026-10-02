import { describe, expect, it } from "vitest";

import { slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";

const PLAIN = slotVariantClass("list", "item", "variant", "plain");

describe("renderList", () => {
  it("renders a bulleted list as a ul of li", () => {
    const { getByRole } = rendered("- one\n- two\n");

    expect(getByRole("list").tagName).toBe("UL");
  });

  it("renders a numbered list from the number the author wrote", () => {
    const { getByRole } = rendered("3. three\n4. four\n");

    expect(getByRole("list").getAttribute("start")).toBe("3");
  });

  it("renders a tight item's words directly in the li", () => {
    const { getByText } = rendered("- one\n- two\n");

    expect(getByText("one").tagName).toBe("LI");
  });

  it("renders a loose item's words in a paragraph", () => {
    const { getByText } = rendered("- one\n\n- two\n");

    expect(getByText("one").tagName).toBe("P");
  });

  it("renders a nested list after a tight item's words", () => {
    const { getAllByRole } = rendered("- one\n  - inner\n- two\n");

    expect(getAllByRole("list")[1]?.textContent).toBe("inner");
  });

  it("states a done task's state before its words", () => {
    const { getByRole } = rendered("- [x] Review the record\n");

    expect(getByRole("listitem").textContent).toBe("Completed task Review the record");
  });

  it("states an open task's state before its words", () => {
    const { getByRole } = rendered("- [ ] Sign off the audit\n");

    expect(getByRole("listitem").textContent).toBe("Incomplete task Sign off the audit");
  });

  it("marks a done task's box with data-checked", () => {
    const { container } = rendered("- [x] Review the record\n");

    expect(slotElement(container, "markdown", "taskMark").dataset["checked"]).toBe("");
  });

  it("renders the caller's glyph in place of the box", () => {
    const { container } = rendered("- [ ] Sign off the audit\n", {
      glyphs: { tasks: { done: <b>done</b>, open: <i>open</i> } },
    });

    expect([
      container.querySelector("i")?.textContent,
      container.querySelector("[data-checked]"),
    ]).toStrictEqual(["open", null]);
  });

  it("renders a list of tasks without bullets", () => {
    const { getAllByRole } = rendered("- [x] one\n- [ ] two\n");

    expect(getAllByRole("listitem")[0]?.classList.contains(PLAIN)).toBe(true);
  });

  it("keeps the bullets of a list whose items are not all tasks", () => {
    const { getAllByRole } = rendered("- [x] one\n- two\n");

    expect(getAllByRole("listitem")[0]?.classList.contains(PLAIN)).toBe(false);
  });
});
