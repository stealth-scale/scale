import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, watched } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function slides(): HTMLElement[] {
  return screen.getAllByRole("group", { hidden: true });
}

describe("Item", () => {
  it("renders a group with the role description slide", async () => {
    await drawn(composed());

    expect(slides()[0]?.getAttribute("aria-roledescription")).toBe("slide");
  });

  it("names a slide by its position among the slides", async () => {
    await drawn(composed());

    expect(slides()[1]?.getAttribute("aria-label")).toBe("2 of 5");
  });

  it("takes the caller's aria-label", async () => {
    await drawn(
      <Carousel.Root slideCount={1}>
        <Carousel.ItemGroup>
          <Carousel.Item aria-label="Ledger" index={0} />
        </Carousel.ItemGroup>
      </Carousel.Root>,
    );

    expect(slides()[0]?.getAttribute("aria-label")).toBe("Ledger");
  });

  it("snaps a slide at the caller's snapAlign", async () => {
    await drawn(
      <Carousel.Root slideCount={1}>
        <Carousel.ItemGroup>
          <Carousel.Item index={0} snapAlign="center" />
        </Carousel.ItemGroup>
      </Carousel.Root>,
    );

    expect(slides()[0]?.style.scrollSnapAlign).toBe("center");
  });

  it("makes a slide out of view inert", async () => {
    const report = watched();

    await drawn(composed());
    report([0]);

    expect(slides()[1]?.inert).toBe(true);
  });

  it("leaves a slide in view without inert", async () => {
    const report = watched();

    await drawn(composed());
    report([0]);

    expect(slides()[0]?.inert).toBe(false);
  });
});
