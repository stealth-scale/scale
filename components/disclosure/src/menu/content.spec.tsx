import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#menu/index.ts";
import { composed, nested } from "#menu/menu.fixtures.tsx";

/**
 * Makes the element scroll: `overflow-y: auto` around content four times its height.
 */
function overflowed(element: HTMLElement): void {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(400);
  element.style.overflowY = "auto";
}

/**
 * Waits for the machine to settle and for the next animation frame, in which it reveals a row.
 */
async function framed(): Promise<void> {
  await settled();
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "content").tagName).toBe("DIV");
  });

  it("sets role menu", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("sets aria-activedescendant to the highlighted row's id", async () => {
    await drawn(composed({ defaultHighlightedValue: "rename", defaultOpen: true }));

    expect(screen.getByRole("menu").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("menuitem", { name: "Rename" }).id,
    );
  });

  it("sets tabindex 0", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu").getAttribute("tabindex")).toBe("0");
  });

  it("sets --menu-depth to its depth in the nest", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }, { lazyMount: false }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.style.getPropertyValue("--menu-depth"))).toStrictEqual([
      "0",
      "1",
    ]);
  });

  it("sets data-nested on a submenu's panel alone", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }, { lazyMount: false }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.dataset["nested"])).toStrictEqual([undefined, ""]);
  });

  it("sets data-side to the machine's placement", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "content").dataset["side"]).toBe("bottom");
  });

  it("keeps focus on the trigger when a highlight and Escape land in one frame", async () => {
    await drawn(composed({ defaultOpen: true }));
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowDown" });
      fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
      await Promise.resolve();
    });
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Actions/u }));
  });

  it("renders the rows inside a scroll area's viewport", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "rows").parentElement).toBe(
      slotElement(container, "menu", "viewport"),
    );
  });

  it("renders the arrow outside the scroll area", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "arrow").parentElement).toBe(
      slotElement(container, "menu", "content"),
    );
  });

  it("renders the menu as the scroll area's viewport", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu")).toBe(slotElement(container, "menu", "viewport"));
  });

  it("sets the menu's direction on the scroll area", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, dir: "rtl" }));

    expect(slotElement(container, "scroll-area", "root").getAttribute("dir")).toBe("rtl");
  });

  it("scrolls the row an arrow key highlights into view in the scroll area's viewport", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    const { container } = await drawn(composed({ defaultOpen: true }));

    overflowed(slotElement(container, "menu", "viewport"));
    fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowDown" });
    await framed();

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      screen.getByRole("menuitem", { name: "Rename" }),
      [{ block: "nearest" }],
    ]);
  });

  it("leaves the rows in place when the pointer highlights a row", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    const { container } = await drawn(composed({ defaultOpen: true }));

    overflowed(slotElement(container, "menu", "viewport"));
    fireEvent.pointerMove(screen.getByRole("menuitem", { name: "Duplicate" }), {
      pointerType: "mouse",
    });
    await framed();

    expect(reveal).not.toHaveBeenCalled();
  });

  it("renders nothing while closed", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".menu__content")).toBeNull();
  });

  it("keeps the hidden panel while closed with lazyMount false", async () => {
    const { container } = await drawn(composed({ lazyMount: false }));

    expect(slotElement(container, "menu", "content").hasAttribute("hidden")).toBe(true);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content as="section" />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "menu", "content").tagName).toBe("SECTION");
  });
});
