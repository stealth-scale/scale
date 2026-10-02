import { describe, expect, it } from "vitest";

import { textStyles } from "#preset/styles/text-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("textStyles", () => {
  it("keys each size style by the name of its font size token", () => {
    expect(tokenAt(textStyles, "md")).toStrictEqual({
      fontSize: "md",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("declares six roles beside the size styles", () => {
    expect(Object.keys(textStyles).filter((name) => !/^\d?x?[a-z]{2}$/u.test(name))).toStrictEqual([
      "body",
      "caption",
      "code",
      "display",
      "heading",
      "label",
    ]);
  });

  it("sets heading.md in the heading face at snug leading", () => {
    expect(tokenAt(textStyles, "heading.md")).toStrictEqual({
      fontFamily: "heading",
      fontSize: "xl",
      fontWeight: "semibold",
      letterSpacing: "normal",
      lineHeight: "snug",
    });
  });

  it("sets heading.sm at normal leading", () => {
    expect(tokenAt(textStyles, "heading.sm")).toMatchObject({
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });

  it("sets heading.xl bold with tight leading and tight tracking", () => {
    expect(tokenAt(textStyles, "heading.xl")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tight",
      lineHeight: "tight",
    });
  });

  it("sets display.lg bold at 7xl with no leading and the tightest tracking", () => {
    expect(tokenAt(textStyles, "display.lg")).toMatchObject({
      fontSize: "7xl",
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
  });

  it("offers a label at every control size", () => {
    expect(Object.keys(tokenAt(textStyles, "label") ?? {}).toSorted()).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("sets label.md medium", () => {
    expect(tokenAt(textStyles, "label.md")).toMatchObject({ fontWeight: "medium" });
  });

  it("grows the label slower than its control above xl", () => {
    expect(tokenAt(textStyles, "label.2xl")).toMatchObject({ fontSize: "xl" });
    expect(tokenAt(textStyles, "label.4xl")).toMatchObject({ fontSize: "2xl" });
  });

  it("offers a heading at eight sizes up to 8xl", () => {
    expect(Object.keys(tokenAt(textStyles, "heading") ?? {})).toHaveLength(8);
    expect(tokenAt(textStyles, "heading.4xl")).toMatchObject({ fontSize: "8xl" });
  });

  it("offers body text at five sizes", () => {
    expect(Object.keys(tokenAt(textStyles, "body") ?? {})).toHaveLength(5);
  });

  it("sets code in the monospaced face", () => {
    expect(tokenAt(textStyles, "code.sm")).toMatchObject({ fontFamily: "mono", fontSize: "sm" });
  });

  it("sets body text at normal leading", () => {
    expect(tokenAt(textStyles, "body.md")).toStrictEqual({
      fontSize: "md",
      fontWeight: "normal",
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });
});
