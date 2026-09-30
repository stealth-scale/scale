import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed, laidOut } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function trigger(name = "Previous slide"): HTMLButtonElement {
  return screen.getByRole("button", { name });
}

describe("PrevTrigger", () => {
  it("renders a button named Previous slide", async () => {
    await drawn(composed());

    expect(trigger().tagName).toBe("BUTTON");
  });

  it("takes the caller's label", async () => {
    await drawn(
      <Carousel.Root slideCount={2}>
        <Carousel.PrevTrigger label="Previous picture" />
      </Carousel.Root>,
    );

    expect(trigger("Previous picture").tagName).toBe("BUTTON");
  });

  it("moves to the previous page on a press", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 2 }));

    await pressed(trigger());

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("sets aria-disabled on the first page of a carousel that does not loop", async () => {
    laidOut();
    await drawn(composed());

    expect([trigger().getAttribute("aria-disabled"), trigger().disabled]).toStrictEqual([
      "true",
      false,
    ]);
  });

  it("keeps focus on a press that reaches the first page", async () => {
    laidOut();
    await drawn(composed({ defaultPage: 1 }));

    act(() => {
      trigger().focus();
    });
    await pressed(trigger());

    expect(document.activeElement).toBe(trigger());
  });

  it("sets the ghost look under the slides", async () => {
    await drawn(composed());

    expect(trigger().classList.contains("button--ghost")).toBe(true);
  });

  it("sets the surface look over the slides", async () => {
    await drawn(composed({ controls: "overlay" }));

    expect(trigger().classList.contains("button--surface")).toBe(true);
  });
});
