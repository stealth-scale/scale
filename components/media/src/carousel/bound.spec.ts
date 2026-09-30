import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { lookOf } from "#carousel/bound.ts";
import { composed } from "#carousel/carousel.fixtures.tsx";

describe("bound", () => {
  it("returns the ghost look for controls beside the slides", () => {
    expect(lookOf("outside")).toBe("ghost");
  });

  it("returns the surface look for controls over the slides", () => {
    expect(lookOf("overlay")).toBe("surface");
  });

  it.each([
    { name: "Previous slide", slot: "carousel__prev-trigger" },
    { name: "Next slide", slot: "carousel__next-trigger" },
    { name: "Start slide rotation", slot: "carousel__autoplay-trigger" },
  ])("renders $name as the library's button with $slot", async ({ name, slot }) => {
    await drawn(composed());

    expect([...screen.getByRole("button", { name }).classList]).toStrictEqual(
      expect.arrayContaining(["button", slot]),
    );
  });
});
