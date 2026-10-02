import { type MouseEvent } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#carousel/carousel.fixtures.tsx";
import * as Carousel from "#carousel/index.ts";

function control(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("AutoplayTrigger", () => {
  it("renders a button named Start slide rotation while the carousel does not rotate", async () => {
    await drawn(composed());

    expect(control("Start slide rotation").tagName).toBe("BUTTON");
  });

  it("renders a button named Stop slide rotation while the carousel rotates", async () => {
    await drawn(composed({ autoplay: true }));

    expect(control("Stop slide rotation").tagName).toBe("BUTTON");
  });

  it("starts the rotation on a press", async () => {
    const { container } = await drawn(composed());

    await pressed(control("Start slide rotation"));

    expect(slotElement(container, "carousel", "itemGroup").getAttribute("aria-live")).toBe("off");
  });

  it("stops the rotation on a press", async () => {
    await drawn(composed({ autoplay: true }));

    await pressed(control("Stop slide rotation"));

    expect(control("Start slide rotation").tagName).toBe("BUTTON");
  });

  it("leaves data-pressed off while the carousel rotates", async () => {
    await drawn(composed({ autoplay: true }));

    expect(control("Stop slide rotation").dataset["pressed"]).toBeUndefined();
  });

  it("takes the caller's names for both actions", async () => {
    await drawn(
      <Carousel.Root autoplay slideCount={2}>
        <Carousel.AutoplayTrigger startLabel="Play" stopLabel="Pause" />
      </Carousel.Root>,
    );

    await pressed(control("Pause"));

    expect(control("Play").tagName).toBe("BUTTON");
  });

  it("leaves the rotation when the caller cancels the press", async () => {
    await drawn(
      <Carousel.Root autoplay slideCount={2}>
        <Carousel.AutoplayTrigger
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
          }}
        />
      </Carousel.Root>,
    );

    await pressed(control("Stop slide rotation"));

    expect(control("Stop slide rotation").tagName).toBe("BUTTON");
  });

  it("sets the surface look over the slides", async () => {
    await drawn(composed({ controls: "overlay" }));

    expect(control("Start slide rotation").classList.contains("button--surface")).toBe(true);
  });
});
