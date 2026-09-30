import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed, laidOut } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function trigger(name = "Next slide"): HTMLButtonElement {
  return screen.getByRole("button", { name });
}

describe("NextTrigger", () => {
  it("renders a button named Next slide", async () => {
    await drawn(composed());

    expect(trigger().tagName).toBe("BUTTON");
  });

  it("takes the caller's label", async () => {
    await drawn(
      <Carousel.Root slideCount={2}>
        <Carousel.NextTrigger label="Next picture" />
      </Carousel.Root>,
    );

    expect(trigger("Next picture").tagName).toBe("BUTTON");
  });

  it("takes the caller's variant", async () => {
    await drawn(
      <Carousel.Root slideCount={2}>
        <Carousel.NextTrigger variant="solid" />
      </Carousel.Root>,
    );

    expect(trigger().classList.contains("button--solid")).toBe(true);
  });

  it("moves to the next page on a press", async () => {
    laidOut();
    await drawn(composed());

    await pressed(trigger());

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("sets aria-disabled on the last page of a carousel that does not loop", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 4 }));

    expect(trigger().getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves the page on a press on the last page", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 4 }));

    await pressed(trigger());

    expect(screen.getByText("5 / 5")).toBeDefined();
  });
});
