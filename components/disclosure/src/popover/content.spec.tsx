import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#popover/index.ts";
import { composed } from "#popover/popover.fixtures.tsx";

/**
 * Waits for the next animation frame, in which the presence reads the closed panel's animation.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

/**
 * Returns the panel, shown or hidden, or null while it is out of the document.
 */
function panel(): HTMLElement | null {
  return screen.queryByRole("dialog", { hidden: true });
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "popover", "content").tagName).toBe("DIV");
  });

  it("sets role dialog", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("sets aria-labelledby to the title's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Filter the list" }).id,
    );
  });

  it("sets aria-describedby to the description's id", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "popover", "description").id,
    );
  });

  it("sets aria-labelledby to the title's id when the popover opens after mounting", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Filters" }));
    await frame();

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Filter the list" }).id,
    );
  });

  it("sets aria-describedby to the description's id when the popover opens after mounting", async () => {
    const { container } = await drawn(composed());

    await pressed(screen.getByRole("button", { name: "Filters" }));
    await frame();

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "popover", "description").id,
    );
  });

  it("leaves aria-labelledby off without a title", async () => {
    await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content aria-label="Filters" />
        </Positioner>
      </Root>,
    );

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBeNull();
  });

  it("leaves aria-describedby off without a description", async () => {
    await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content aria-label="Filters" />
        </Positioner>
      </Root>,
    );

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBeNull();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content as="section" />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "popover", "content").tagName).toBe("SECTION");
  });

  it("renders nothing before the popover first opens", async () => {
    await drawn(composed());

    expect(panel()).toBeNull();
  });

  it("renders nothing once the popover closes", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("button", { name: "Filters" }));
    await frame();

    expect(panel()).toBeNull();
  });

  it("keeps the hidden panel once the popover closes with unmountOnExit false", async () => {
    await drawn(composed({ defaultOpen: true, unmountOnExit: false }));
    await pressed(screen.getByRole("button", { name: "Filters" }));
    await frame();

    expect(panel()?.hidden).toBe(true);
  });
});
