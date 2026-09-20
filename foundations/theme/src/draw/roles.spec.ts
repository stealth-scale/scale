import { describe, expect, it } from "vitest";

import { roles } from "#draw/roles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("roles", () => {
  it("names the six roles", () => {
    expect(Object.keys(roles())).toStrictEqual([
      "body",
      "caption",
      "code",
      "display",
      "heading",
      "label",
    ]);
  });

  it("sets a page heading in the heading face a little closer than the text", () => {
    expect(tokenAt(roles(), "heading.md")).toStrictEqual({
      fontFamily: "heading",
      fontSize: "xl",
      fontWeight: "semibold",
      letterSpacing: "normal",
      lineHeight: "snug",
    });
  });

  it("keeps a section heading at the text's own leading and a hero heading tight and tracked in", () => {
    expect(tokenAt(roles(), "heading.sm")).toMatchObject({
      letterSpacing: "normal",
      lineHeight: "normal",
    });
    expect(tokenAt(roles(), "heading.xl")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tight",
      lineHeight: "tight",
    });
  });

  it("takes a heading weight and tracking and leading the theme states over every step's own", () => {
    const stated = roles({ heading: { leading: "none", tracking: "tighter", weight: "bold" } });

    expect(tokenAt(stated, "heading.sm")).toMatchObject({
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
    expect(tokenAt(stated, "heading.4xl")).toMatchObject({ fontWeight: "bold" });
  });

  it("sets body text at normal leading or the leading the theme states", () => {
    expect(tokenAt(roles(), "body.md")).toStrictEqual({
      fontSize: "md",
      fontWeight: "normal",
      letterSpacing: "normal",
      lineHeight: "normal",
    });
    expect(tokenAt(roles({ body: { leading: "relaxed" } }), "body.lg")).toMatchObject({
      lineHeight: "relaxed",
    });
  });

  it("sets a label medium or at the weight the theme states and grows it slower than its control above xl", () => {
    expect(tokenAt(roles(), "label.md")).toMatchObject({ fontWeight: "medium" });
    expect(tokenAt(roles({ label: { weight: "semibold" } }), "label.xs")).toMatchObject({
      fontWeight: "semibold",
    });
    expect(tokenAt(roles(), "label.2xl")).toMatchObject({ fontSize: "lg" });
    expect(tokenAt(roles(), "label.4xl")).toMatchObject({ fontSize: "2xl" });
  });

  it("sets a display role bold with no leading and the tightest tracking and code in the monospaced face", () => {
    expect(tokenAt(roles(), "display.lg")).toMatchObject({
      fontSize: "7xl",
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
    expect(tokenAt(roles(), "code.sm")).toMatchObject({ fontFamily: "mono", fontSize: "sm" });
  });
});
