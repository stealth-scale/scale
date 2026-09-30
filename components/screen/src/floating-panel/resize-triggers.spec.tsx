import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened } from "#floating-panel/floating-panel.fixtures.tsx";
import { ResizeTriggers } from "#floating-panel/index.ts";

/**
 * Returns the axis of every resize trigger in the render, in document order.
 *
 * @param container - The render's container.
 */
function axes(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLElement>("[data-part=resize-trigger]")].map(
    (element) => element.dataset["axis"] ?? "",
  );
}

describe("ResizeTriggers", () => {
  it("renders the four edges and then the four corners when axes is absent", async () => {
    const { container } = await drawn(opened(<ResizeTriggers />));

    expect(axes(container)).toStrictEqual(["n", "e", "s", "w", "ne", "nw", "se", "sw"]);
  });

  it("renders a trigger for each axis the caller lists", async () => {
    const { container } = await drawn(opened(<ResizeTriggers axes={["e", "s", "se"]} />));

    expect(axes(container)).toStrictEqual(["e", "s", "se"]);
  });

  it("passes the props to every trigger", async () => {
    const { container } = await drawn(opened(<ResizeTriggers axes={["e", "s"]} data-edge="" />));

    expect(container.querySelectorAll("[data-edge]")).toHaveLength(2);
  });
});
