import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { changesOf, type DiffLine } from "#code-block/changes.ts";
import { AFTER, BEFORE, coded } from "#code-block/code-block.fixtures.tsx";
import { emptyOf, fillerOf, foldOf, keyOf, lineOf, type RowScope } from "#code-block/diff-rows.tsx";
import { diffWordsOf, WORDS } from "#code-block/diff-words.ts";
import { piecesOf } from "#code-block/segments.ts";

/**
 * Lines of the retry helper's diff: fourteen lines, changed at 2, 3, 9 and 10.
 */
const LINES = changesOf(BEFORE, AFTER);

/**
 * Returns the line of the retry diff at an index.
 */
function lineAt(index: number): DiffLine {
  const line = LINES[index];

  if (line === undefined) throw new Error(`The retry diff has no line ${String(index)}.`);

  return line;
}

/**
 * Returns the scope of the retry diff's rows, with any field replaced.
 */
function scopeOf(fields: Partial<RowScope> = {}): RowScope {
  return {
    after: piecesOf(AFTER, "ts"),
    before: piecesOf(BEFORE, "ts"),
    firsts: new Set(),
    marks: true,
    onOpen: vi.fn<RowScope["onOpen"]>(),
    words: WORDS,
    ...fields,
  };
}

/**
 * Returns the text of each line number the render contains.
 */
function numbersOf(container: HTMLElement): Array<null | string> {
  return Array.from(container.querySelectorAll(".code-block__number"), (cell) => cell.textContent);
}

describe("rows", () => {
  it("joins the numbers of both versions in a line's key", () => {
    expect(keyOf(lineAt(4))).toBe("4:4");
  });

  it("writes a dash for each number a line's key lacks", () => {
    expect([keyOf(lineAt(2)), keyOf()]).toStrictEqual(["3:-", "-:-"]);
  });

  it("renders both numbers of an unchanged line in a unified diff", () => {
    const { container } = render(coded(lineOf(lineAt(4), "both", scopeOf())));

    expect(numbersOf(container)).toStrictEqual(["4", "4"]);
  });

  it("renders an empty later number for a removed line in a unified diff", () => {
    const { container } = render(coded(lineOf(lineAt(2), "both", scopeOf())));

    expect(numbersOf(container)).toStrictEqual(["3", ""]);
  });

  it("renders the earlier number alone on the before side", () => {
    const { container } = render(coded(lineOf(lineAt(4), "before", scopeOf())));

    expect(numbersOf(container)).toStrictEqual(["4"]);
  });

  it("renders the later number alone on the after side", () => {
    const { container } = render(coded(lineOf(lineAt(3), "after", scopeOf())));

    expect(numbersOf(container)).toStrictEqual(["3"]);
  });

  it("hides every line number from a screen reader", () => {
    const { container } = render(coded(lineOf(lineAt(4), "both", scopeOf())));

    expect(
      Array.from(container.querySelectorAll(".code-block__number"), (cell) =>
        cell.getAttribute("aria-hidden"),
      ),
    ).toStrictEqual(["true", "true"]);
  });

  it("writes the kind of the line in data-kind", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(slotElement(container, "code-block", "line").dataset["kind"]).toBe("added");
  });

  it.each([
    { index: 3, want: "+" },
    { index: 2, want: "−" },
    { index: 4, want: " " },
  ])("renders $want as the mark of line $index", ({ index, want }) => {
    const { container } = render(coded(lineOf(lineAt(index), "both", scopeOf())));

    expect(container.querySelector(".code-block__mark > [aria-hidden=true]")?.textContent).toBe(
      want,
    );
  });

  it("states Added in visually hidden words before an added line's text", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(container.querySelector(".code-block__mark .visually-hidden")?.textContent).toBe(
      "Added ",
    );
  });

  it("states Removed in visually hidden words before a removed line's text", () => {
    const { container } = render(coded(lineOf(lineAt(2), "both", scopeOf())));

    expect(container.querySelector(".code-block__mark .visually-hidden")?.textContent).toBe(
      "Removed ",
    );
  });

  it("states no words for an unchanged line", () => {
    const { container } = render(coded(lineOf(lineAt(4), "both", scopeOf())));

    expect(container.querySelector(".visually-hidden")).toBeNull();
  });

  it("states the caller's addedLabel", () => {
    const words = diffWordsOf({ addedLabel: "Neu" });
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf({ words }))));

    expect(container.querySelector(".visually-hidden")?.textContent).toBe("Neu ");
  });

  it("renders the whole text of a line in the text slot", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(slotElement(container, "code-block", "text").textContent).toBe(
      "export async function retry(task, attempts = 5) {",
    );
  });

  it("renders a classified token in a span with its kind", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(container.querySelector("[data-token]")?.outerHTML).toBe(
      '<span data-token="keyword">export</span>',
    );
  });

  it("renders the word an added line gained in ins", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(container.querySelector("ins")?.textContent).toBe("5");
  });

  it("renders the word a removed line lost in del", () => {
    const { container } = render(coded(lineOf(lineAt(2), "both", scopeOf())));

    expect(container.querySelector("del")?.textContent).toBe("3");
  });

  it("keeps the token kind of a changed word inside ins", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf())));

    expect(container.querySelector<HTMLElement>("ins > [data-token]")?.dataset["token"]).toBe(
      "number",
    );
  });

  it("renders a line break as the text of an empty line", () => {
    const { container } = render(coded(lineOf(lineAt(1), "both", scopeOf())));

    expect(slotElement(container, "code-block", "text").innerHTML).toBe("<br>");
  });

  it("renders a changed stretch across several tokens in one ins", () => {
    const { container } = render(coded(lineOf(lineAt(10), "both", scopeOf())));

    expect(Array.from(container.querySelectorAll("ins"), (mark) => mark.textContent)).toStrictEqual(
      [" * 2 ** attempt"],
    );
  });

  it("renders no changed word when marks is false", () => {
    const { container } = render(coded(lineOf(lineAt(3), "both", scopeOf({ marks: false }))));

    expect(container.querySelector("ins")).toBeNull();
  });

  it("lets a script focus the first line of an open fold", () => {
    const firsts = new Set([lineAt(5)]);
    const { container } = render(coded(lineOf(lineAt(5), "both", scopeOf({ firsts }))));

    expect(slotElement(container, "code-block", "line").getAttribute("tabindex")).toBe("-1");
  });

  it("leaves a line that starts no open fold out of focus", () => {
    const { container } = render(coded(lineOf(lineAt(6), "both", scopeOf())));

    expect(slotElement(container, "code-block", "line").hasAttribute("tabindex")).toBe(false);
  });

  it("leaves the after side of an open fold's first line out of focus", () => {
    const firsts = new Set([lineAt(5)]);
    const { container } = render(coded(lineOf(lineAt(5), "after", scopeOf({ firsts }))));

    expect(slotElement(container, "code-block", "line").hasAttribute("tabindex")).toBe(false);
  });

  it("names a fold's button by the lines it hides", () => {
    render(coded(foldOf({ count: 3, start: 5 }, scopeOf())));

    expect(screen.getByRole("button").textContent).toBe("Show 3 unchanged lines");
  });

  it("calls onOpen with the fold when its button is pressed", () => {
    const onOpen = vi.fn<RowScope["onOpen"]>();
    const fold = { count: 3, start: 5 };

    render(coded(foldOf(fold, scopeOf({ onOpen }))));
    fireEvent.click(screen.getByRole("button"));

    expect(onOpen.mock.lastCall?.[0]).toBe(fold);
  });

  it("renders a fold's button as a button that submits no form", () => {
    render(coded(foldOf({ count: 1, start: 0 }, scopeOf())));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("hides the empty side of a pair from a screen reader", () => {
    const { container } = render(coded(fillerOf("before")));

    expect(slotElement(container, "code-block", "filler").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the words of a diff without changes in the empty slot", () => {
    const { container } = render(coded(emptyOf("No changes")));

    expect(slotElement(container, "code-block", "empty").textContent).toBe("No changes");
  });
});
