import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, region } from "#marquee/marquee.fixtures.tsx";

/**
 * Returns the edges of the rendered marquee.
 */
function edges(): HTMLElement[] {
  return [...region().querySelectorAll<HTMLElement>('[data-part="edge"]')];
}

describe("Edge", () => {
  it("writes the side it fades as data-side", async () => {
    await drawn(composed());

    expect(edges().map((edge) => edge.dataset["side"])).toStrictEqual(["start", "end"]);
  });

  it("places itself over the viewport through the machine's inline style", async () => {
    await drawn(composed());

    expect(edges()[0]?.style.position).toBe("absolute");
  });

  it("takes no pointer events", async () => {
    await drawn(composed());

    expect(edges()[0]?.style.pointerEvents).toBe("none");
  });
});
