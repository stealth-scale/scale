import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#qr-code/qr-code.fixtures.tsx";

/**
 * Returns the fill and the x of every rect in the frame, in document order.
 */
function groundsOf(container: HTMLElement): ReadonlyArray<readonly [null | string, null | string]> {
  return [...slotElement(container, "qr-code", "frame").querySelectorAll("rect")].map((rect) => [
    rect.getAttribute("fill"),
    rect.getAttribute("x"),
  ]);
}

describe("Frame", () => {
  it("renders an svg in the img role", async () => {
    await drawn(composed());

    expect(screen.getByRole("img").tagName.toLowerCase()).toBe("svg");
  });

  it("takes the name QR code by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("img", { name: "QR code" })).toBeTruthy();
  });

  it("takes its name from label", async () => {
    await drawn(composed({}, { label: "QR code for the invite link" }));

    expect(screen.getByRole("img", { name: "QR code for the invite link" })).toBeTruthy();
  });

  it("renders a white ground under the pattern", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "qr-code", "frame").firstElementChild?.outerHTML).toBe(
      '<rect fill="white" height="100%" width="100%"></rect>',
    );
  });

  it("renders a white ground for the mark over the middle quarter while a mark renders", async () => {
    const { container } = await drawn(composed({}, { marked: true }));

    expect(groundsOf(container)).toStrictEqual([
      ["white", null],
      ["white", "37.5%"],
    ]);
  });

  it("renders one ground without a mark", async () => {
    const { container } = await drawn(composed());

    expect(groundsOf(container)).toStrictEqual([["white", null]]);
  });
});
