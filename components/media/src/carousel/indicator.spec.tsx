import { type MouseEvent } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed, laidOut, SLIDES } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function dot(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("Indicator", () => {
  it("renders a button named Go to slide N", async () => {
    laidOut();
    await drawn(composed());

    expect(dot("Go to slide 3").tagName).toBe("BUTTON");
  });

  it("takes the caller's label", async () => {
    await drawn(
      <Carousel.Root slideCount={1}>
        <Carousel.Indicator index={0} label="Ledger" />
      </Carousel.Root>,
    );

    expect(dot("Ledger").tagName).toBe("BUTTON");
  });

  it("sets aria-disabled on the dot of the current page", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 2 }));

    expect(dot("Go to slide 3").getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves aria-disabled off the dot of another page", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 2 }));

    expect(dot("Go to slide 1").getAttribute("aria-disabled")).toBeNull();
  });

  it("moves to the dot's page on a press", async () => {
    laidOut();
    await drawn(composed());

    await pressed(dot("Go to slide 4"));

    expect(screen.getByText("4 / 5")).toBeDefined();
  });

  it("leaves the page when the caller cancels the press", async () => {
    laidOut();
    await drawn(
      <Carousel.Root slideCount={SLIDES.length}>
        <Carousel.ItemGroup>
          {SLIDES.map((slide, index) => (
            <Carousel.Item index={index} key={slide} />
          ))}
        </Carousel.ItemGroup>
        <Carousel.Indicator
          index={3}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
          }}
        />
        <Carousel.ProgressText />
      </Carousel.Root>,
    );

    await pressed(dot("Go to slide 4"));

    expect(screen.getByText("1 / 5")).toBeDefined();
  });

  it("leaves the page on a press on a read-only dot", async () => {
    laidOut();
    await drawn(
      <Carousel.Root slideCount={SLIDES.length}>
        <Carousel.ItemGroup>
          {SLIDES.map((slide, index) => (
            <Carousel.Item index={index} key={slide} />
          ))}
        </Carousel.ItemGroup>
        <Carousel.Indicator index={3} readOnly />
        <Carousel.ProgressText />
      </Carousel.Root>,
    );

    await pressed(dot("Go to slide 4"));

    expect(screen.getByText("1 / 5")).toBeDefined();
  });
});
