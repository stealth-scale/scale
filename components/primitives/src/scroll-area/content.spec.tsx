import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as ScrollArea from "#scroll-area/index.ts";
import { overflowing, scrolled } from "#scroll-area/scroll-area.fixtures.tsx";

/**
 * Renders a scroll area whose content is a list of three releases.
 */
function listed(): ReactElement {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport aria-label="Releases">
        <ScrollArea.Content as="ul">
          <li>4.2</li>
          <li>4.1</li>
          <li>4.0</li>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "content").tagName).toBe("DIV");
  });

  it("takes no role", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "content").getAttribute("role")).toBeNull();
  });

  it("renders the element passed as as", async () => {
    const { container } = await drawn(listed());

    expect(slotElement(container, "scroll-area", "content").tagName).toBe("UL");
  });

  it("keeps the list role of a list passed as as", async () => {
    await drawn(listed());

    expect(screen.getByRole("list").tagName).toBe("UL");
  });

  it("gives the element passed as as the machine's id", async () => {
    const { container } = await drawn(listed());

    expect(slotElement(container, "scroll-area", "content").id).toMatch(
      /^scroll-area-.+:content$/u,
    );
  });

  it("leaves its width to the recipe", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "content").style.minWidth).toBe("");
  });

  it("leaves the axis the content fits unmarked", async () => {
    const report = overflowing({ y: true });
    const { container } = await drawn(scrolled());

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "content").dataset["overflowX"]).toBeUndefined();
  });
});
