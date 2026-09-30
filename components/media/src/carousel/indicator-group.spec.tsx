import { type KeyboardEvent } from "react";

import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, laidOut, SLIDES } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function dot(page: number): HTMLElement {
  return screen.getByRole("button", { name: `Go to slide ${String(page)}` });
}

async function keyed(key: string): Promise<void> {
  act(() => {
    dot(1).focus();
  });
  fireEvent.keyDown(dot(1), { key });
  await settled();
}

describe("IndicatorGroup", () => {
  it("renders a div with the carousel's orientation", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "carousel", "indicatorGroup").dataset["orientation"]).toBe(
      "horizontal",
    );
  });

  it("moves to the next page on ArrowRight on a dot", async () => {
    laidOut();
    await drawn(composed());

    await keyed("ArrowRight");

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("moves focus to the dot of the new page", async () => {
    laidOut();
    await drawn(composed());

    await keyed("ArrowRight");
    await settled();

    expect(document.activeElement).toBe(dot(2));
  });

  it("moves to the last page on End", async () => {
    laidOut();
    await drawn(composed());

    await keyed("End");

    expect(screen.getByText("5 / 5")).toBeDefined();
  });

  it("leaves the page on a key that moves no page", async () => {
    laidOut();
    await drawn(composed());

    await keyed("Enter");

    expect(screen.getByText("1 / 5")).toBeDefined();
  });

  it("leaves the page when the caller cancels the key", async () => {
    laidOut();
    await drawn(
      <Carousel.Root slideCount={SLIDES.length}>
        <Carousel.ItemGroup>
          {SLIDES.map((slide, index) => (
            <Carousel.Item index={index} key={slide} />
          ))}
        </Carousel.ItemGroup>
        <Carousel.IndicatorGroup
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            event.preventDefault();
          }}
        >
          <Carousel.Indicators />
        </Carousel.IndicatorGroup>
        <Carousel.ProgressText />
      </Carousel.Root>,
    );

    await keyed("ArrowRight");

    expect(screen.getByText("1 / 5")).toBeDefined();
  });
});
