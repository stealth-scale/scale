import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { segmented } from "#progress/progress.fixtures.tsx";
import { Root } from "#progress/root.tsx";
import { Segment } from "#progress/segment.tsx";
import { Track } from "#progress/track.tsx";

/**
 * Returns each segment's share of the track, as its custom property states it.
 */
function sharesOf(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLElement>(".progress__segment")].map((segment) =>
    segment.style.getPropertyValue("--progress-share"),
  );
}

describe("Segment", () => {
  it("renders a SPAN for the segment slot", async () => {
    const { container } = await drawn(segmented([{ key: "photos", value: 25 }]));

    expect(slotElement(container, "progress", "segment").tagName).toBe("SPAN");
  });

  it("sets each segment's share of the range", async () => {
    const { container } = await drawn(
      segmented(
        [
          { key: "photos", value: 25 },
          { key: "apps", value: 50 },
        ],
        { max: 200, value: 75 },
      ),
    );

    expect(sharesOf(container)).toStrictEqual(["12.5%", "25%"]);
  });

  it("measures its share against the range from min", async () => {
    const { container } = await drawn(
      segmented([{ key: "photos", value: 10 }], { max: 50, min: 10, value: 20 }),
    );

    expect(sharesOf(container)).toStrictEqual(["25%"]);
  });

  it("gives a value past the range the whole track", async () => {
    const { container } = await drawn(segmented([{ key: "photos", value: 150 }], { value: 100 }));

    expect(sharesOf(container)).toStrictEqual(["100%"]);
  });

  it("gives a value under zero no share", async () => {
    const { container } = await drawn(segmented([{ key: "photos", value: -5 }], { value: 0 }));

    expect(sharesOf(container)).toStrictEqual(["0%"]);
  });

  it("writes the palette it states as data-color", async () => {
    const { container } = await drawn(
      segmented([{ color: "error", key: "failed", value: 25 }], { value: 25 }),
    );

    expect(slotElement(container, "progress", "segment").dataset["color"]).toBe("error");
  });

  it("writes the series color it states as data-color", async () => {
    const { container } = await drawn(
      segmented([{ color: "series.3", key: "photos", value: 25 }], { value: 25 }),
    );

    expect(slotElement(container, "progress", "segment").dataset["color"]).toBe("series.3");
  });

  it("writes no color without one", async () => {
    const { container } = await drawn(segmented([{ key: "photos", value: 25 }], { value: 25 }));

    expect(slotElement(container, "progress", "segment").dataset["color"]).toBeUndefined();
  });

  it("keeps the style the caller passes beside its share", async () => {
    const { container } = await drawn(
      <Root value={50}>
        <Track aria-label="Disk">
          <Segment style={{ opacity: 0.5 }} value={50} />
        </Track>
      </Root>,
    );

    expect(slotElement(container, "progress", "segment").style.opacity).toBe("0.5");
  });

  it("returns no accessibility violation inside a labelled bar", async () => {
    await expect(
      accessibilityViolations(() =>
        segmented(
          [
            { key: "photos", value: 30 },
            { color: "neutral", key: "other", value: 20 },
          ],
          { value: 50 },
        ),
      ),
    ).resolves.toStrictEqual([]);
  });
});
