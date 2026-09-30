import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type TimelineEvent } from "#events/layout.ts";
import { at, DAY, drawn, LANES, textsOf } from "#timeline-chart/timeline-chart.fixtures.tsx";
import { TimelineChart } from "#timeline-chart/timeline-chart.tsx";

/**
 * Focuses the chart's tab stop from the keyboard and presses keys on it, then returns the
 * container.
 */
function keyed(container: Element, keys: readonly string[]): Element {
  const surface = container.querySelector<SVGSVGElement>(".recharts-surface");

  act(() => {
    surface?.focus();
  });

  for (const key of keys) fireEvent.keyDown(surface ?? document.body, { key });

  return container;
}

describe("TimelineChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <TimelineChart
          caption="The api raised three alerts within six minutes."
          events={DAY}
          label="Deploys and incidents on 28 September"
          lanes={LANES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("sizes the plot by its lanes", () => {
    const plot = drawn().querySelector<HTMLElement>(".chart__plot");

    expect(plot?.style.getPropertyValue("--chart-rows")).toBe("3");
  });

  it("gives the plot the rows ratio", () => {
    expect(drawn().querySelector(".chart__plot--rows")).not.toBeNull();
  });

  it("renders No data in the plot's place without moments", () => {
    expect(textsOf(drawn({ events: [] }), ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders its empty message without a moment inside the window", () => {
    const container = drawn({ empty: "Nothing happened.", since: at(22), until: at(23) });

    expect(textsOf(container, ".chart__empty")).toStrictEqual(["Nothing happened."]);
  });

  it("names the figure by its caption", () => {
    expect(textsOf(drawn({ caption: "The api broke at 14:03." }), "figcaption")).toStrictEqual([
      "The api broke at 14:03.",
    ]);
  });

  it("names the lane of the moments without a lane by otherLabel", () => {
    expect(
      textsOf(
        drawn({ otherLabel: "Notices" }),
        ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ).at(-1),
    ).toBe("Notices");
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: true,
      defaultIndex: 0,
      minGap: 0.01,
      moreLabel: (count) => `+${String(count)}`,
      otherLabel: "Notices",
      ticks: 3,
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("hands the caller a marker's moments on a press", () => {
    const onSelect = vi.fn<(events: readonly TimelineEvent[]) => void>();
    const marker = drawn({ onSelect }).querySelector('.chart-marker[data-walk="1"]');

    fireEvent.click(marker ?? document.body);

    expect(onSelect.mock.lastCall?.[0].map((event) => event.key)).toStrictEqual(["b1", "b2", "b3"]);
  });

  it("walks the markers lane by lane with the arrow keys", () => {
    const container = keyed(drawn(), ["ArrowRight", "ArrowRight", "ArrowRight"]);

    expect(textsOf(container, ".chart__heading")).toStrictEqual(["Web, 10:00"]);
  });

  it("selects the marker the walk is at on Enter", () => {
    const onSelect = vi.fn<(events: readonly TimelineEvent[]) => void>();

    keyed(drawn({ onSelect }), ["ArrowRight", "Enter"]);

    expect(onSelect.mock.lastCall?.[0].map((event) => event.key)).toStrictEqual(["b1", "b2", "b3"]);
  });
});
