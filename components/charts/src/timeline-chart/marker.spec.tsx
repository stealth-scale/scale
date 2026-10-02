import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { layoutEvents } from "#events/layout.ts";
import { Marker, type MarkerProps } from "#timeline-chart/marker.tsx";
import { type MarkerDatum, markersOf } from "#timeline-chart/markers.ts";
import { at, DAY } from "#timeline-chart/timeline-chart.fixtures.tsx";

/**
 * Lists the markers of the day: the api's deploy first and its burst of three alerts second.
 */
const MARKERS = markersOf(
  layoutEvents(DAY, { lanes: ["api", "web"], since: at(0), until: at(24) }).lanes,
);

/**
 * Returns the marker at a place in the walk of a list of markers, the day's by default.
 */
function markerAt(walk: number, markers: readonly MarkerDatum[] = MARKERS): MarkerDatum {
  const marker = markers[walk];

  if (marker === undefined) throw new Error(`The list has no marker at ${String(walk)}.`);

  return marker;
}

/**
 * Renders a marker at 100 across and 40 down with the props a case changes, and returns its group.
 */
function drawn(walk: number, props: Partial<MarkerProps> = {}): null | SVGGElement {
  return render(
    <svg>
      <Marker cx={100} cy={40} datum={markerAt(walk)} {...props} />
    </svg>,
  ).container.querySelector("g");
}

/**
 * Renders the burst's marker with a first place and returns a spy on the pointer's mouseover.
 */
function pointed(initial: number): () => void {
  const over = vi.fn<() => void>();
  const host = document.createElement("div");

  document.body.append(host);
  host.addEventListener("mouseover", () => {
    over();
  });
  render(
    <svg>
      <Marker cx={100} cy={40} datum={markerAt(1)} initial={initial} />
    </svg>,
    { container: host },
  );

  return over;
}

describe("Marker", () => {
  it("renders a dot of radius 6 for one moment", () => {
    const dot = drawn(0)?.querySelector("circle");

    expect([
      dot?.getAttribute("cx"),
      dot?.getAttribute("cy"),
      dot?.getAttribute("r"),
    ]).toStrictEqual(["100", "40", "6"]);
  });

  it("renders a pill with the count of a cluster", () => {
    const marker = drawn(1);

    expect([marker?.querySelector("rect") !== null, marker?.textContent]).toStrictEqual([
      true,
      "3",
    ]);
  });

  it("renders a pill with the count of a cluster of two moments", () => {
    const pair = [0, 1].map((minute) => ({
      at: at(14, minute),
      key: String(minute),
      label: "Alert",
    }));
    const datum = markerAt(0, markersOf(layoutEvents(pair, { since: at(0), until: at(24) }).lanes));

    expect(drawn(0, { datum })?.querySelector("rect + text")?.textContent).toBe("2");
  });

  it("centres a pill 20px tall on the marker's place", () => {
    const pill = drawn(1)?.querySelector("rect");

    expect([pill?.getAttribute("height"), pill?.getAttribute("y")]).toStrictEqual(["20", "30"]);
  });

  it("widens the pill by 7px per digit of the count", () => {
    const flood = Array.from({ length: 12 }, (_, index) => ({
      at: at(14, index),
      key: String(index),
      label: "Alert",
    }));
    const datum = markerAt(
      0,
      markersOf(layoutEvents(flood, { since: at(0), until: at(24) }).lanes),
    );

    expect(drawn(0, { datum })?.querySelector("rect")?.getAttribute("width")).toBe("28");
  });

  it("sets the marker class on its group", () => {
    expect(drawn(1)?.getAttribute("class")).toBe("chart-marker");
  });

  it("writes its place in the walk to data-walk", () => {
    expect(drawn(1)?.dataset["walk"]).toBe("1");
  });

  it("sets its color in the marker's custom property", () => {
    expect(drawn(1)?.style.getPropertyValue("--chart-marker")).toBe("var(--colors-error-chart)");
  });

  it("hands its datum to the press", () => {
    const onPress = vi.fn<(datum: MarkerDatum) => void>();
    const marker = drawn(1, { onPress });

    fireEvent.click(marker ?? document.body);

    expect(onPress.mock.lastCall?.[0].walk).toBe(1);
  });

  it("marks a marker a press selects", () => {
    expect(drawn(1, { onPress: vi.fn<(datum: MarkerDatum) => void>() })?.dataset["press"]).toBe("");
  });

  it("leaves a marker without a press unmarked", () => {
    expect(drawn(1)?.dataset["press"]).toBeUndefined();
  });

  it("sends the pointer to itself when its place is the initial one", () => {
    expect(pointed(1)).toHaveBeenCalledExactlyOnceWith();
  });

  it("sends no pointer when another place is the initial one", () => {
    expect(pointed(0)).not.toHaveBeenCalled();
  });
});
