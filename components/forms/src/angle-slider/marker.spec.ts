import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";

/**
 * Returns every marker, in the order the markers render.
 */
function markers(container: ParentNode): readonly HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(`.${slotClass("angle-slider", "marker")}`)];
}

describe("Marker", () => {
  it("renders an empty span", async () => {
    const { container } = await drawn(composed());
    const [first] = markers(container);

    expect([first?.tagName, first?.childElementCount]).toStrictEqual(["SPAN", 0]);
  });

  it("reports whether it lies under or over the value", async () => {
    const { container } = await drawn(composed());

    expect(markers(container).map((marker) => marker.dataset["state"])).toStrictEqual([
      "under-value",
      "over-value",
      "over-value",
      "over-value",
    ]);
  });

  it("turns to its angle", async () => {
    const { container } = await drawn(composed());

    expect(markers(container)[1]?.style.getPropertyValue("--marker-display-value")).toBe("90");
  });
});
