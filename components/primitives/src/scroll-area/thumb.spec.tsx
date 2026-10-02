import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as ScrollArea from "#scroll-area/index.ts";

describe("Thumb", () => {
  it("takes the orientation of the bar it is rendered in", async () => {
    const { container } = await drawn(
      <ScrollArea.Root>
        <ScrollArea.Viewport aria-label="Notes" />
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    expect(slotElement(container, "scroll-area", "thumb").dataset["orientation"]).toBe(
      "horizontal",
    );
  });

  it("takes the vertical orientation outside a bar", async () => {
    const { container } = await drawn(
      <ScrollArea.Root>
        <ScrollArea.Viewport aria-label="Notes" />
        <ScrollArea.Thumb />
      </ScrollArea.Root>,
    );

    expect(slotElement(container, "scroll-area", "thumb").dataset["orientation"]).toBe("vertical");
  });
});
