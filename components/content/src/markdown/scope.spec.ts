import { describe, expect, it } from "vitest";

import { scopeOf } from "#markdown/markdown.fixtures.tsx";
import {
  footnoteId,
  footnotesId,
  headingSizeOf,
  levelOf,
  referenceId,
  tagOf,
  textOf,
} from "#markdown/scope.ts";

describe("scope", () => {
  it("renders a heading at its depth while headingLevel is 1", () => {
    expect(levelOf(scopeOf(), 2)).toBe(2);
  });

  it("renders a heading headingLevel minus one levels below its depth", () => {
    expect(levelOf(scopeOf({ headingLevel: 3 }), 2)).toBe(4);
  });

  it("renders a heading no deeper than level 6", () => {
    expect(levelOf(scopeOf({ headingLevel: 4 }), 5)).toBe(6);
  });

  it.each([
    { level: 1, want: "h1" },
    { level: 6, want: "h6" },
    { level: 9, want: "h6" },
  ])("returns $want for level $level", ({ level, want }) => {
    expect(tagOf(level)).toBe(want);
  });

  it.each([
    { level: 1, size: "md", want: "2xl" },
    { level: 3, size: "md", want: "lg" },
    { level: 6, size: "md", want: "xs" },
    { level: 1, size: "sm", want: "xl" },
    { level: 6, size: "sm", want: "xs" },
  ] as const)("sizes a level $level heading $want in a $size document", ({ level, size, want }) => {
    expect(headingSizeOf(scopeOf({ size }), level)).toBe(want);
  });

  it("prefixes a footnote's id with the document's prefix", () => {
    expect(footnoteId(scopeOf(), "1")).toBe("doc-fn-1");
  });

  it("returns a first reference's id without a suffix", () => {
    expect(referenceId(scopeOf(), "1")).toBe("doc-fnref-1");
  });

  it("suffixes a later reference's id with its index", () => {
    expect(referenceId(scopeOf(), "1", 2)).toBe("doc-fnref-1-2");
  });

  it("returns the footnotes heading's id with the document's prefix", () => {
    expect(footnotesId(scopeOf())).toBe("doc-footnotes");
  });

  it("returns the plain text of inline nodes without their marks", () => {
    expect(
      textOf([
        { type: "text", value: "Keep " },
        { children: [{ type: "text", value: "30" }], type: "strong" },
        { type: "inlineCode", value: " days" },
        { alt: " of logs", src: "/a.png", type: "image" },
      ]),
    ).toBe("Keep 30 days of logs");
  });

  it("returns no text for a break or a footnote reference", () => {
    expect(textOf([{ type: "break" }, { id: "1", number: 1, type: "footnoteReference" }])).toBe("");
  });
});
