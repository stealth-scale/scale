import { describe, expect, it } from "vitest";

import { textStyles } from "#preset/styles/text-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("textStyles", () => {
  it("draws every size of the type scale by the name of its token", () => {
    expect(tokenAt(textStyles, "md")).toStrictEqual({
      fontSize: "md",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("names the roles over the sizes", () => {
    expect(Object.keys(textStyles).filter((name) => !/^\d?x?[a-z]{2}$/u.test(name))).toStrictEqual([
      "body",
      "caption",
      "code",
      "display",
      "heading",
      "label",
    ]);
  });

  it("sets a page heading in the heading face a little closer than the text", () => {
    expect(tokenAt(textStyles, "heading.md")).toStrictEqual({
      fontFamily: "heading",
      fontSize: "xl",
      fontWeight: "semibold",
      letterSpacing: "normal",
      lineHeight: "snug",
    });
  });

  it("keeps a section heading at the text's own leading and a hero heading tight and tracked in", () => {
    expect(tokenAt(textStyles, "heading.sm")).toMatchObject({
      letterSpacing: "normal",
      lineHeight: "normal",
    });
    expect(tokenAt(textStyles, "heading.xl")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tight",
      lineHeight: "tight",
    });
  });

  it("sets a display role bold with no leading and the tightest tracking", () => {
    expect(tokenAt(textStyles, "display.lg")).toMatchObject({
      fontSize: "7xl",
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
  });

  it("offers a label for every control size", () => {
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
    expect(tokenAt(textStyles, "label.md")).toMatchObject({ fontWeight: "medium" });
  });

  it("grows a label slower than its control above xl", () => {
    expect(tokenAt(textStyles, "label.2xl")).toMatchObject({ fontSize: "lg" });
    expect(tokenAt(textStyles, "label.4xl")).toMatchObject({ fontSize: "2xl" });
  });

  it("offers a heading from xs to 4xl and a body from xs to xl", () => {
    expect(Object.keys(tokenAt(textStyles, "heading") ?? {})).toHaveLength(8);
    expect(tokenAt(textStyles, "heading.4xl")).toMatchObject({ fontSize: "8xl" });
    expect(Object.keys(tokenAt(textStyles, "body") ?? {})).toHaveLength(5);
  });

  it("sets code in the monospaced face", () => {
    expect(tokenAt(textStyles, "code.sm")).toMatchObject({ fontFamily: "mono", fontSize: "sm" });
  });

  it("sets body text in the body face at normal leading", () => {
    expect(tokenAt(textStyles, "body.md")).toStrictEqual({
      fontSize: "md",
      fontWeight: "normal",
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });
});
