import { describe, expect, it } from "vitest";

import { roles } from "#draw/roles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const LABEL_STEPS = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

describe("roles", () => {
  it("declares six roles", () => {
    expect(Object.keys(roles())).toStrictEqual([
      "body",
      "caption",
      "code",
      "display",
      "heading",
      "label",
    ]);
  });

  it("sets heading.md in the heading face at snug leading", () => {
    expect(tokenAt(roles(), "heading.md")).toStrictEqual({
      fontFamily: "heading",
      fontSize: "xl",
      fontWeight: "semibold",
      letterSpacing: "normal",
      lineHeight: "snug",
    });
  });

  it("sets heading.sm at normal leading", () => {
    expect(tokenAt(roles(), "heading.sm")).toMatchObject({
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });

  it("sets heading.xl bold with tight leading and tight tracking", () => {
    expect(tokenAt(roles(), "heading.xl")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tight",
      lineHeight: "tight",
    });
  });

  it("applies the heading style the theme states to every step", () => {
    const stated = roles({ heading: { leading: "none", tracking: "tighter", weight: "bold" } });

    expect(tokenAt(stated, "heading.sm")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
    expect(tokenAt(stated, "heading.4xl")).toMatchObject({ fontWeight: "bold" });
  });

  it("sets body text at normal leading by default", () => {
    expect(tokenAt(roles(), "body.md")).toStrictEqual({
      fontSize: "md",
      fontWeight: "normal",
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });

  it("sets body text at the leading the theme states", () => {
    expect(tokenAt(roles({ body: { leading: "relaxed" } }), "body.lg")).toMatchObject({
      lineHeight: "relaxed",
    });
  });

  it("sets a label medium by default", () => {
    expect(tokenAt(roles(), "label.md")).toMatchObject({ fontWeight: "medium" });
  });

  it("sets a label at the weight the theme states", () => {
    expect(tokenAt(roles({ label: { weight: "semibold" } }), "label.xs")).toMatchObject({
      fontWeight: "semibold",
    });
  });

  it("grows the label slower than its control above xl", () => {
    expect(tokenAt(roles(), "label.2xl")).toMatchObject({ fontSize: "xl" });
    expect(tokenAt(roles(), "label.4xl")).toMatchObject({ fontSize: "2xl" });
  });

  it("never sets a larger label step in a smaller font size", () => {
    const sizes = LABEL_STEPS.map((step) =>
      LABEL_STEPS.indexOf(String(tokenAt(tokenAt(roles(), `label.${step}`), "fontSize"))),
    );

    expect(sizes).toStrictEqual(sizes.toSorted((first, second) => first - second));
  });

  it("sets display.lg bold at 7xl with no leading and the tightest tracking", () => {
    expect(tokenAt(roles(), "display.lg")).toMatchObject({
      fontSize: "7xl",
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
  });

  it("sets code in the monospaced face", () => {
    expect(tokenAt(roles(), "code.sm")).toMatchObject({ fontFamily: "mono", fontSize: "sm" });
  });
});
