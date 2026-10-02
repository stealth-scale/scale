import { describe, expect, it } from "vitest";

import { mentioned, queryAt } from "#composer/mentions.ts";

describe("mentions", () => {
  it("finds the query of a trigger at the start of the text", () => {
    expect(queryAt("@ad", 3, ["@"])).toStrictEqual({ from: 0, term: "ad", trigger: "@" });
  });

  it("finds the query of a trigger after a space", () => {
    expect(queryAt("Thanks @ad", 10, ["@"])).toStrictEqual({ from: 7, term: "ad", trigger: "@" });
  });

  it("finds the query of a trigger after a line break", () => {
    expect(queryAt("Thanks\n@ad", 10, ["@"])).toStrictEqual({ from: 7, term: "ad", trigger: "@" });
  });

  it("finds an empty term right after the trigger", () => {
    expect(queryAt("@", 1, ["@"])).toStrictEqual({ from: 0, term: "", trigger: "@" });
  });

  it("finds no query for a trigger inside a word", () => {
    expect(queryAt("ada@example.com", 15, ["@"])).toBeUndefined();
  });

  it("finds no query once whitespace follows the term", () => {
    expect(queryAt("@ada lov", 8, ["@"])).toBeUndefined();
  });

  it("finds no query without a trigger before the caret", () => {
    expect(queryAt("Hello", 5, ["@"])).toBeUndefined();
  });

  it("reads the term up to the caret only", () => {
    expect(queryAt("@adam", 3, ["@"])).toStrictEqual({ from: 0, term: "ad", trigger: "@" });
  });

  it("finds the query of the one trigger open at the caret", () => {
    expect(queryAt("@ada #en", 8, ["@", "#"])).toStrictEqual({
      from: 5,
      term: "en",
      trigger: "#",
    });
  });

  it("finds the open query whatever the order of the triggers", () => {
    expect(queryAt("x #eng @ad", 10, ["@", "#"])).toStrictEqual({
      from: 7,
      term: "ad",
      trigger: "@",
    });
  });

  it("replaces the query with the mention and a space", () => {
    expect(
      mentioned("Thanks @ad", { from: 7, term: "ad", trigger: "@" }, 10, "Ada Okafor"),
    ).toStrictEqual({ caret: 19, text: "Thanks @Ada Okafor " });
  });

  it("keeps the text after the caret", () => {
    expect(
      mentioned("@ad, see this", { from: 0, term: "ad", trigger: "@" }, 3, "Ada"),
    ).toStrictEqual({ caret: 5, text: "@Ada , see this" });
  });
});
