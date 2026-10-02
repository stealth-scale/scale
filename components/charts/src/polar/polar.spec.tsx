import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { sectorsOf, sharesOf, SLICES } from "#polar/polar.fixtures.ts";
import { Polar, type PolarCoreProps } from "#polar/polar.tsx";

/**
 * Returns the centre, the start and the end of the first sector's arc, read from its path: `M` at
 * the start, an arc `A r,r,0,large,sweep` to the end, then `L` to the centre.
 */
function pointsOf(container: Element): Array<{ x: number; y: number }> {
  const path = container.querySelector(".recharts-pie-sector path")?.getAttribute("d") ?? "";
  const numbers = [...path.matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) => Number(match[0]));

  return [
    { x: numbers[9] ?? 0, y: numbers[10] ?? 0 },
    { x: numbers[0] ?? 0, y: numbers[1] ?? 0 },
    { x: numbers[7] ?? 0, y: numbers[8] ?? 0 },
  ];
}

/**
 * Renders the core over the fixture slices, with the props a case changes.
 */
function drawn(props: Partial<PolarCoreProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(<Polar hole={0} label="Customers per plan" slices={SLICES} {...props} />);
}

describe("Polar", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <Polar
          caption="Starter has 60% of the customers."
          hole={0}
          label="Customers per plan"
          slices={SLICES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the keyboard layer by the label", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface title")?.textContent).toBe(
      "Customers per plan",
    );
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Starter has 60% of the customers." });

    expect(getByRole("figure", { name: "Starter has 60% of the customers." })).toBeDefined();
  });

  it("renders a sector per slice largest first", () => {
    const { container } = drawn();

    expect(sectorsOf(container)).toStrictEqual(["starter", "growth", "scale"]);
  });

  it("colors each sector with its slice's series color", () => {
    const { container } = drawn();

    expect(
      container.querySelector(".recharts-pie-sector path[name=growth]")?.getAttribute("fill"),
    ).toBe("var(--colors-series-2)");
  });

  it("writes each slice's share on it", () => {
    const { container } = drawn();

    expect(sharesOf(container)).toStrictEqual(["60%", "30%", "10%"]);
  });

  it("writes no shares when shares is off", () => {
    const { container } = drawn({ shares: false });

    expect(container.querySelector(".recharts-label-list")).toBeNull();
  });

  it("leaves a slice the legend hides out of the pie", () => {
    const { container } = drawn({ defaultHiddenKeys: ["starter"] });

    expect(sectorsOf(container)).toStrictEqual(["growth", "scale"]);
  });

  it("writes the shares of the slices shown", () => {
    const { container } = drawn({ defaultHiddenKeys: ["starter"] });

    expect(sharesOf(container)).toStrictEqual(["75%", "25%"]);
  });

  it("fades every other slice while the pointer is on a legend button", () => {
    const { container, getByRole } = drawn();

    act(() => {
      fireEvent.pointerEnter(getByRole("button", { name: "Growth" }));
    });

    expect(
      [...container.querySelectorAll(".recharts-pie-sector path")].map((sector) =>
        sector.getAttribute("opacity"),
      ),
    ).toStrictEqual(["var(--chart-faded)", "1", "var(--chart-faded)"]);
  });

  it("gathers the slices past maxSlices into Other", () => {
    const { container } = drawn({ maxSlices: 2 });

    expect(sectorsOf(container)).toStrictEqual(["starter", "other"]);
  });

  it("lists the gathered slice in the legend by otherLabel", () => {
    const { getByRole } = drawn({ maxSlices: 2, otherLabel: "Other plans" });

    expect(getByRole("button", { name: "Other plans" })).toBeDefined();
  });

  it("renders the legend unless stated", () => {
    const { getByRole } = drawn({ legendLabel: "Plans" });

    expect(getByRole("group", { name: "Plans" })).toBeDefined();
  });

  it("renders no legend when legend is off", () => {
    const { container } = drawn({ legend: false });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders no legend without slices", () => {
    const { container } = drawn({ slices: [] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders No data in the plot's place without slices", () => {
    const { container } = drawn({ slices: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without slices", () => {
    const { container } = drawn({ empty: "No customers yet.", slices: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No customers yet.");
  });

  it("renders the tooltip at the slice defaultIndex names on the first render", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("Growth");
  });

  it("writes the tooltip's value with valueOptions", () => {
    const { container } = drawn({
      defaultIndex: 0,
      locale: "en-US",
      valueOptions: { minimumFractionDigits: 1 },
    });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("600.0");
  });

  it("starts the largest slice at 12 o'clock", () => {
    const [center, start] = pointsOf(drawn().container);

    expect([start?.x, (start?.y ?? 0) < (center?.y ?? 0)]).toStrictEqual([center?.x, true]);
  });

  it("runs the slices clockwise", () => {
    const [center, , end] = pointsOf(drawn().container);

    expect(end?.x ?? Number.POSITIVE_INFINITY).toBeLessThan(center?.x ?? 0);
  });

  it("renders no tooltip heading for a slice", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("gives the plot the square ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "landscape" });

    expect(container.querySelector(".chart__plot--landscape")).not.toBeNull();
  });

  it("takes the pie's own group out of the tab order", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-pie")?.getAttribute("tabindex")).toBe("-1");
  });

  it("renders the center over the plot", () => {
    const { container } = drawn({ center: "1,000", centerLabel: "customers", hole: "58%" });

    expect(container.querySelector(".chart__center")?.textContent).toBe("1,000customers");
  });

  it("renders no center without one", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__center")).toBeNull();
  });
});
