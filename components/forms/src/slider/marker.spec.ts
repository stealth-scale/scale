import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#slider/slider.fixtures.tsx";

/**
 * Returns every marker's state, in the order the markers render.
 */
function states(container: ParentNode): ReadonlyArray<string | undefined> {
  return [...container.querySelectorAll<HTMLElement>(`.${slotClass("slider", "marker")}`)].map(
    (marker) => marker.dataset["state"],
  );
}

describe("Marker", () => {
  it("renders its words", async () => {
    await drawn(composed());

    expect(screen.getByText("Half").tagName).toBe("SPAN");
  });

  it("reports whether it lies under or over the value", async () => {
    const { container } = await drawn(composed());

    expect(states(container)).toStrictEqual(["under-value", "over-value", "over-value"]);
  });

  it("lies at its value on the track", async () => {
    await drawn(composed());

    expect(screen.getByText("Half").style.insetInlineStart).toBe("50%");
  });
});
