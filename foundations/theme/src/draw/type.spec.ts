import { describe, expect, it } from "vitest";

import { roles } from "#draw/roles.ts";
import { fontSizes, ROLE_SIZES, typeScale, typography } from "#draw/type.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const STEPS = [
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

function styleOf(name: string, property: string): string {
  return String(Reflect.get(tokenAt(typography(), name) ?? {}, property));
}

describe("type", () => {
  it("draws a size for every rung of the scale", () => {
    expect(Object.keys(fontSizes())).toStrictEqual(STEPS);
  });

  it("puts the body size where the theme stated it", () => {
    expect(tokenAt(fontSizes(), "md")).toBe("1.0000rem");
    expect(tokenAt(fontSizes(1.25), "md")).toBe("1.2500rem");
  });

  it("spaces the rungs by the ratio it was given", () => {
    expect(tokenAt(fontSizes(1, 1.5), "lg")).toBe("1.5000rem");
  });

  it("draws a smaller rung below the body size", () => {
    expect(Number(String(tokenAt(fontSizes(), "sm")).replace("rem", ""))).toBeLessThan(1);
  });

  it("draws a text style for every rung the sizes have", () => {
    expect(Object.keys(typography())).toStrictEqual(STEPS);
  });

  it("states the size by name with the leading and the tracking it is read at", () => {
    expect(tokenAt(typography(), "md")).toStrictEqual({
      fontSize: "md",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("names the size token of the same rung", () => {
    expect(styleOf("3xl", "fontSize")).toBe("3xl");
    expect(Object.keys(fontSizes())).toContain("3xl");
  });

  it("tightens the leading as the size grows", () => {
    expect(Number(styleOf("7xl", "lineHeight"))).toBeLessThan(Number(styleOf("sm", "lineHeight")));
    expect(styleOf("7xl", "lineHeight")).toBe("1.1");
  });

  it("tightens the tracking at display sizes alone", () => {
    expect(styleOf("md", "letterSpacing")).toBe("0em");
    expect(styleOf("xl", "letterSpacing")).toBe("-0.01em");
    expect(styleOf("4xl", "letterSpacing")).toBe("-0.02em");
  });

  it("draws the sizes and the styles from one base and one ratio with the roles over them", () => {
    expect(typeScale({ base: 1.25, ratio: 1.2 })).toStrictEqual({
      fontSizes: fontSizes(1.25, 1.2),
      textStyles: { ...typography(1.25, 1.2), ...roles() },
    });
  });

  it("draws the foundation's scale when nothing is stated", () => {
    expect(typeScale()).toStrictEqual({
      fontSizes: fontSizes(),
      textStyles: { ...typography(), ...roles() },
    });
  });

  it("draws the roles with what the theme states about them", () => {
    expect(
      tokenAt(typeScale({ heading: { weight: "bold" } }).textStyles, "heading.sm"),
    ).toMatchObject({
      fontWeight: "bold",
    });
  });

  it("offers each role the steps it has", () => {
    expect(ROLE_SIZES.body).toStrictEqual(["xs", "sm", "md", "lg", "xl"]);
    expect(ROLE_SIZES.heading).toHaveLength(8);
  });
});
