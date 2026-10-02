import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useHighlight, type UseHighlightOptions } from "#use-highlight.ts";

const SENTENCE = "The offer was raised, and the offer settled.";

function chunked(options: UseHighlightOptions): ReturnType<typeof useHighlight> {
  return renderHook(() => useHighlight(options)).result.current;
}

describe("useHighlight", () => {
  it("marks every occurrence of a term", () => {
    expect(chunked({ query: "offer", text: SENTENCE })).toStrictEqual([
      { match: false, text: "The " },
      { match: true, text: "offer" },
      { match: false, text: " was raised, and the " },
      { match: true, text: "offer" },
      { match: false, text: " settled." },
    ]);
  });

  it("ignores letter case when ignoreCase is absent", () => {
    expect(chunked({ query: "the", text: SENTENCE }).filter(({ match }) => match)).toStrictEqual([
      { match: true, text: "The" },
      { match: true, text: "the" },
    ]);
  });

  it("matches letter case when ignoreCase is false", () => {
    expect(
      chunked({ ignoreCase: false, query: "the", text: SENTENCE }).filter(({ match }) => match),
    ).toStrictEqual([{ match: true, text: "the" }]);
  });

  it("marks every term of an array query", () => {
    expect(
      chunked({ query: ["raised", "settled"], text: SENTENCE }).filter(({ match }) => match),
    ).toStrictEqual([
      { match: true, text: "raised" },
      { match: true, text: "settled" },
    ]);
  });

  it("marks the longer of two terms that match at one place", () => {
    expect(
      chunked({ query: ["off", "offer"], text: "offer" }).filter(({ match }) => match),
    ).toStrictEqual([{ match: true, text: "offer" }]);
  });

  it("trims each term", () => {
    expect(chunked({ query: " offer ", text: "an offer" })).toStrictEqual([
      { match: false, text: "an " },
      { match: true, text: "offer" },
    ]);
  });

  it.each([
    { label: "an empty string", query: "" },
    { label: "spaces", query: "   " },
    { label: "an empty array", query: [] },
  ])("returns the text unmarked when the query is $label", ({ query }) => {
    expect(chunked({ query, text: SENTENCE })).toStrictEqual([{ match: false, text: SENTENCE }]);
  });

  it("matches the characters a regular expression reads as written", () => {
    expect(chunked({ query: "(a)", text: "x (a) y" })).toStrictEqual([
      { match: false, text: "x " },
      { match: true, text: "(a)" },
      { match: false, text: " y" },
    ]);
  });
});
