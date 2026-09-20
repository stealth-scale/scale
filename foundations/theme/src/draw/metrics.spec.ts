import { describe, expect, it } from "vitest";

import {
  controls,
  DENSITIES,
  DENSITY,
  gaps,
  icons,
  insets,
  metrics,
  SCALE,
  tags,
  WIDTHS,
} from "#draw/metrics.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const STEPS = ["2xl", "3xl", "4xl", "lg", "md", "sm", "xl", "xs"];

/**
 * Reads the rem a scaled step states as the number it states.
 */
function rem(length: unknown): number {
  return Number(/(?<rem>[\d.]+)rem/u.exec(String(length))?.groups?.["rem"]);
}

describe("metrics", () => {
  it.each([controls, icons, insets, gaps, tags])("draws eight steps with %o", (scale) => {
    expect(Object.keys(scale()).toSorted()).toStrictEqual(STEPS);
  });

  it("lists the eight steps and the twelve measures in the order they grow", () => {
    expect(SCALE).toStrictEqual(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]);
    expect(WIDTHS).toHaveLength(12);
    expect(WIDTHS[0]).toBe("xs");
    expect(WIDTHS.at(-1)).toBe("8xl");
  });

  it("names the density property and sets it below one for compact and above for comfortable", () => {
    expect(DENSITY).toBe("--density");
    expect(DENSITIES.compact).toBeLessThan(1);
    expect(DENSITIES.comfortable).toBeGreaterThan(1);
  });

  it("multiplies every scaled step by the run-time density", () => {
    expect(tokenAt(controls(), "md")).toBe("2.5000rem");
  });

  it("draws a medium control at the base it was given", () => {
    expect(tokenAt(controls(), "md")).toBe("2.5000rem");
    expect(tokenAt(controls(3), "md")).toBe("3.0000rem");
  });

  it("draws the control steps a tenth apart up to xl and twice the base at 4xl", () => {
    expect(tokenAt(controls(), "xs")).toBe("2.0000rem");
    expect(tokenAt(controls(), "xl")).toBe("3.0000rem");
    expect(tokenAt(controls(), "2xl")).toBe("3.5000rem");
    expect(tokenAt(controls(), "4xl")).toBe("5.0000rem");
  });

  it("draws an icon box from three fifths to three times the base", () => {
    expect(tokenAt(icons(), "xs")).toBe("0.7500rem");
    expect(tokenAt(icons(), "md")).toBe("1.2500rem");
    expect(tokenAt(icons(), "xl")).toBe("2.0000rem");
    expect(tokenAt(icons(), "4xl")).toBe("3.7500rem");
  });

  it("draws the inset from half to three times the base", () => {
    expect(tokenAt(insets(), "xs")).toBe("0.5000rem");
    expect(tokenAt(insets(), "xl")).toBe("1.5000rem");
    expect(tokenAt(insets(), "4xl")).toBe("3.0000rem");
  });

  it("draws the gap from half to six times the base", () => {
    expect(tokenAt(gaps(), "xs")).toBe("0.2500rem");
    expect(tokenAt(gaps(), "xl")).toBe("1.0000rem");
    expect(tokenAt(gaps(), "4xl")).toBe("3.0000rem");
  });

  it("draws a medium tag at the base it was given", () => {
    expect(tokenAt(tags(), "md")).toBe("1.5000rem");
    expect(tokenAt(tags(2), "md")).toBe("2.0000rem");
  });

  it("draws a tag on the shares a control grows by", () => {
    expect(tokenAt(tags(), "xs")).toBe("1.2000rem");
    expect(tokenAt(tags(), "xl")).toBe("1.8000rem");
    expect(tokenAt(tags(), "4xl")).toBe("3.0000rem");
  });

  it.each(STEPS)("draws a tag shorter than the control named %s", (step) => {
    expect(rem(tokenAt(tags(), step))).toBeLessThan(rem(tokenAt(controls(), step)));
  });

  it("draws every semantic size and spacing at the foundation's density", () => {
    const { sizes, spacing } = metrics();

    expect(Object.keys(sizes).toSorted()).toStrictEqual([
      "aside",
      "control",
      "icon",
      "page",
      "prose",
      "rail",
      "sidebar",
      "tag",
    ]);
    expect(Object.keys(spacing).toSorted()).toStrictEqual(["gap", "inset", "marker", "safe"]);
    expect(tokenAt(sizes, "control.md")).toBe("2.5000rem");
    expect(tokenAt(sizes, "icon.md")).toBe("1.2500rem");
    expect(tokenAt(sizes, "tag.md")).toBe("1.5000rem");
    expect(tokenAt(spacing, "inset.md")).toBe("1.0000rem");
    expect(tokenAt(spacing, "gap.md")).toBe("0.5000rem");
  });

  it("draws the layout widths and the measures a page reads at", () => {
    const { sizes } = metrics();

    expect(tokenAt(sizes, "sidebar")).toBe("16rem");
    expect(tokenAt(sizes, "aside")).toBe("20rem");
    expect(tokenAt(sizes, "rail")).toBe("4rem");
    expect(tokenAt(sizes, "page.narrow")).toBe("48rem");
    expect(tokenAt(sizes, "page.wide")).toBe("80rem");
    expect(tokenAt(sizes, "prose")).toBe("65ch");
  });

  it("leaves the marker gutter in ems and reads the safe area from the browser", () => {
    const { spacing } = metrics();

    expect(tokenAt(spacing, "marker")).toBe("2.5em");
    expect(tokenAt(spacing, "safe.top")).toBe("env(safe-area-inset-top, 0px)");
    expect(tokenAt(spacing, "safe.left")).toBe("env(safe-area-inset-left, 0px)");
  });

  it("multiplies the five scales by the theme's density and leaves the layout alone", () => {
    const { sizes, spacing } = metrics({ scale: 2 });

    expect(tokenAt(sizes, "control.md")).toBe("5.0000rem");
    expect(tokenAt(sizes, "icon.md")).toBe("2.5000rem");
    expect(tokenAt(sizes, "tag.md")).toBe("3.0000rem");
    expect(tokenAt(spacing, "inset.md")).toBe("2.0000rem");
    expect(tokenAt(spacing, "gap.md")).toBe("1.0000rem");
    expect(tokenAt(sizes, "sidebar")).toBe("16rem");
    expect(tokenAt(sizes, "prose")).toBe("65ch");
    expect(tokenAt(spacing, "marker")).toBe("2.5em");
  });

  it("moves a base outright where the theme states one", () => {
    const { sizes, spacing } = metrics({
      aside: "24rem",
      control: 3,
      gap: 1,
      icon: 1.5,
      inset: 1.25,
      rail: "3rem",
      sidebar: "18rem",
      tag: 2,
    });

    expect(tokenAt(sizes, "control.md")).toBe("3.0000rem");
    expect(tokenAt(sizes, "icon.md")).toBe("1.5000rem");
    expect(tokenAt(sizes, "tag.md")).toBe("2.0000rem");
    expect(tokenAt(spacing, "inset.md")).toBe("1.2500rem");
    expect(tokenAt(spacing, "gap.md")).toBe("1.0000rem");
    expect(tokenAt(sizes, "aside")).toBe("24rem");
    expect(tokenAt(sizes, "rail")).toBe("3rem");
    expect(tokenAt(sizes, "sidebar")).toBe("18rem");
  });
});
