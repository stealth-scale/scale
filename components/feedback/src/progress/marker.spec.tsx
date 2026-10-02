import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Marker } from "#progress/marker.tsx";
import { marked } from "#progress/progress.fixtures.tsx";
import { Root } from "#progress/root.tsx";
import { Track } from "#progress/track.tsx";

/**
 * Returns the marker's place along the track, as its custom property states it.
 */
function placeOf(container: HTMLElement): string {
  return slotElement(container, "progress", "marker").style.getPropertyValue("--progress-marker");
}

describe("Marker", () => {
  it("renders a DIV for the marker slot", async () => {
    const { container } = await drawn(marked(75));

    expect(slotElement(container, "progress", "marker").tagName).toBe("DIV");
  });

  it("hides itself from assistive technology", async () => {
    const { container } = await drawn(marked(75));

    expect(slotElement(container, "progress", "marker").getAttribute("aria-hidden")).toBe("true");
  });

  it("places itself at its value's share of the range", async () => {
    const { container } = await drawn(marked(75, { max: 200, value: 50 }));

    expect(placeOf(container)).toBe("37.5%");
  });

  it("places itself from min", async () => {
    const { container } = await drawn(marked(30, { max: 50, min: 10, value: 20 }));

    expect(placeOf(container)).toBe("50%");
  });

  it("places a value past max at the end of the range", async () => {
    const { container } = await drawn(marked(120, { value: 50 }));

    expect(placeOf(container)).toBe("100%");
  });

  it("places a value under min at the start of the range", async () => {
    const { container } = await drawn(marked(-5, { value: 50 }));

    expect(placeOf(container)).toBe("0%");
  });

  it("keeps the style the caller passes beside its place", async () => {
    const { container } = await drawn(
      <Root value={50}>
        <Track aria-label="Plan">
          <Marker style={{ opacity: 0.5 }} value={80} />
        </Track>
      </Root>,
    );

    expect(slotElement(container, "progress", "marker").style.opacity).toBe("0.5");
  });

  it("returns no accessibility violation inside a labelled bar", async () => {
    await expect(accessibilityViolations(() => marked(80, { value: 62 }))).resolves.toStrictEqual(
      [],
    );
  });
});
