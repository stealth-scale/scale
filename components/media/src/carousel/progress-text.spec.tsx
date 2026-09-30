import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, laidOut, SLIDES } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

describe("ProgressText", () => {
  it("renders the current page over the number of pages", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 1 }));

    expect(screen.getByText("2 / 5").tagName).toBe("SPAN");
  });

  it("renders the caller's text from the page and the number of pages", async () => {
    laidOut();
    await drawn(
      <Carousel.Root slideCount={SLIDES.length}>
        <Carousel.ItemGroup>
          {SLIDES.map((slide, index) => (
            <Carousel.Item index={index} key={slide} />
          ))}
        </Carousel.ItemGroup>
        <Carousel.ProgressText
          text={({ page, totalPages }) => `Picture ${String(page)} of ${String(totalPages)}`}
        />
      </Carousel.Root>,
    );

    expect(screen.getByText("Picture 1 of 5").tagName).toBe("SPAN");
  });
});
