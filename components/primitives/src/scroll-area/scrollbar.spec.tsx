import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as ScrollArea from "#scroll-area/index.ts";
import { scrolled } from "#scroll-area/scroll-area.fixtures.tsx";

describe("Scrollbar", () => {
  it("renders a vertical bar without an orientation", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["orientation"]).toBe(
      "vertical",
    );
  });

  it("renders the orientation the caller passes", async () => {
    const { container } = await drawn(scrolled());

    expect(
      container.querySelector(".scroll-area__scrollbar[data-orientation=horizontal]"),
    ).not.toBeNull();
  });

  it("renders a thumb without children", async () => {
    const { container } = await drawn(scrolled());

    expect(
      slotElement(container, "scroll-area", "scrollbar").querySelector(".scroll-area__thumb"),
    ).not.toBeNull();
  });

  it("renders the caller's children in place of the thumb", async () => {
    const { container } = await drawn(
      <ScrollArea.Root>
        <ScrollArea.Viewport aria-label="Notes" />
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb className="notes" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    expect(slotElement(container, "scroll-area", "thumb").classList).toContain("notes");
  });
});
