import { screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bare, LABEL, labelled, worded } from "#meter/meter.fixtures.tsx";
import { Root, type RootProps } from "#meter/root.tsx";

describe("Root", () => {
  it("renders the progress recipe's root slot as a DIV", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "root").tagName).toBe("DIV");
  });

  it("renders the meter role", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("62");
  });

  it("renders no progress bar role", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("states the formatted value as aria-valuetext", async () => {
    await drawn(labelled({ locale: "en-US", value: 62 }));

    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("62%");
  });

  it("states the aria-valuetext the caller passes over the formatted value", async () => {
    await drawn(worded("Strong"));

    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("Strong");
  });

  it("takes its name from the label", async () => {
    await drawn(labelled());

    expect(screen.getByRole("meter", { name: LABEL })).toBeDefined();
  });

  it("takes its name from aria-label without a label", async () => {
    await drawn(bare());

    expect(screen.getByRole("meter", { name: LABEL })).toBeDefined();
  });

  it("measures up to the max it is given", async () => {
    await drawn(labelled({ max: 50, min: 10, value: 38 }));

    expect(screen.getByRole("meter").getAttribute("aria-valuemax")).toBe("50");
  });

  it("measures from the min it is given", async () => {
    await drawn(labelled({ max: 50, min: 10, value: 38 }));

    expect(screen.getByRole("meter").getAttribute("aria-valuemin")).toBe("10");
  });

  it("formats the value in the unit formatOptions states", async () => {
    await drawn(
      labelled({ formatOptions: { style: "unit", unit: "gigabyte" }, locale: "en-US", value: 38 }),
    );

    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("38 GB");
  });

  it("returns no accessibility violation for a labelled meter", async () => {
    await expect(accessibilityViolations(() => labelled({ value: 62 }))).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a meter named by aria-label", async () => {
    await expect(accessibilityViolations(() => bare({ value: 30 }))).resolves.toStrictEqual([]);
  });

  it("requires a number as the value in its props type", () => {
    expectTypeOf<RootProps["value"]>().toEqualTypeOf<number>();
    expectTypeOf<{ max: number }>().not.toExtend<RootProps>();

    expect(Root).toBeDefined();
  });

  it("offers no stripes movement or effect in its props type", () => {
    expectTypeOf<RootProps>().not.toHaveProperty("animated");
    expectTypeOf<RootProps>().not.toHaveProperty("striped");
    expectTypeOf<RootProps>().not.toHaveProperty("effect");

    expect(Root).toBeDefined();
  });
});
