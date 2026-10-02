import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#qr-code/qr-code.fixtures.tsx";
import { recipe } from "#qr-code/recipe.ts";
import { type RootProps } from "#qr-code/root.tsx";

/**
 * Returns the view box of the frame in a container.
 */
function viewBoxOf(container: HTMLElement): null | string {
  return slotElement(container, "qr-code", "frame").getAttribute("viewBox");
}

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("sets data-recipe to qr-code", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "qr-code", "root").dataset["recipe"]).toBe("qr-code");
  });

  it("re-encodes the pattern when the value changes", async () => {
    const { container, rerender } = await drawn(composed());
    const before = slotElement(container, "qr-code", "pattern").getAttribute("d");

    rerender(composed({ value: "https://stealthscale.io/join/7fK2mQ" }));

    expect(slotElement(container, "qr-code", "pattern").getAttribute("d")).not.toBe(before);
  });

  it("encodes at error correction H while a mark renders", async () => {
    const { container } = await drawn(composed({}, { marked: true }));

    expect(viewBoxOf(container)).toBe("0 0 370 370");
  });

  it("encodes at error correction L once the mark unmounts", async () => {
    const { container, rerender } = await drawn(composed({}, { marked: true }));

    rerender(composed());

    expect(viewBoxOf(container)).toBe("0 0 330 330");
  });
});
