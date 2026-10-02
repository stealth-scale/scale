import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, laidOut, SLIDES } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

describe("Indicators", () => {
  it("renders one dot per page", async () => {
    laidOut();
    await drawn(composed());

    expect(screen.getAllByRole("button", { name: /^Go to slide/u })).toHaveLength(5);
  });

  it("names each dot through label with its page counted from one", async () => {
    laidOut();
    await drawn(
      <Carousel.Root slideCount={SLIDES.length}>
        <Carousel.ItemGroup>
          {SLIDES.map((slide, index) => (
            <Carousel.Item index={index} key={slide} />
          ))}
        </Carousel.ItemGroup>
        <Carousel.IndicatorGroup>
          <Carousel.Indicators label={(page) => `Picture ${String(page)}`} />
        </Carousel.IndicatorGroup>
      </Carousel.Root>,
    );

    expect(
      screen.getAllByRole("button").map((dot) => dot.getAttribute("aria-label")),
    ).toStrictEqual(["Picture 1", "Picture 2", "Picture 3", "Picture 4", "Picture 5"]);
  });
});
