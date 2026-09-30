import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, laidOut } from "#carousel/carousel.fixtures.tsx";
import { reducedMotion } from "#reduced-motion.fixtures.ts";

async function keyed(key: string, props: Parameters<typeof composed>[0] = {}): Promise<void> {
  const { container } = await drawn(composed(props));

  fireEvent.keyDown(slotElement(container, "carousel", "itemGroup"), { key });
  await settled();
}

describe("ItemGroup", () => {
  it("moves to the next page on ArrowRight", async () => {
    laidOut();
    await keyed("ArrowRight");

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("moves to the last page on End", async () => {
    laidOut();
    await keyed("End");

    expect(screen.getByText("5 / 5")).toBeDefined();
  });

  it("moves to the first page on Home", async () => {
    laidOut();
    await keyed("Home", { defaultPage: 3 });

    expect(screen.getByText("1 / 5")).toBeDefined();
  });

  it("moves to the next page on ArrowDown in a vertical carousel", async () => {
    laidOut("vertical");
    await keyed("ArrowDown", { orientation: "vertical" });

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("moves to the previous page on ArrowRight in a right-to-left carousel", async () => {
    laidOut();
    await keyed("ArrowRight", { defaultPage: 2, dir: "rtl" });

    expect(screen.getByText("2 / 5")).toBeDefined();
  });

  it("leaves the page on a key that moves no page", async () => {
    laidOut();
    await keyed("a");

    expect(screen.getByText("1 / 5")).toBeDefined();
  });

  it("scrolls at once under reduced motion", async () => {
    laidOut();
    reducedMotion(true);
    const scrolled = vi.spyOn(HTMLElement.prototype, "scrollTo");

    await keyed("ArrowRight");

    expect(scrolled).toHaveBeenLastCalledWith({ behavior: "instant", left: 300 });
  });

  it("scrolls smoothly while the reader allows motion", async () => {
    laidOut();
    const scrolled = vi.spyOn(HTMLElement.prototype, "scrollTo");

    await keyed("ArrowRight");

    expect(scrolled).toHaveBeenLastCalledWith({ behavior: "smooth", left: 300 });
  });
});
