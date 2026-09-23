import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#menu/content.tsx";
import { composed, listed, nested } from "#menu/menu.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Content />));

    expect(slotElement(container, "menu", "content").tagName).toBe("DIV");
  });

  it("carries the menu role so a screen reader knows what opened", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("points a screen reader at the row the reader is on rather than moving the focus", async () => {
    await drawn(composed({ defaultHighlightedValue: "rename", defaultOpen: true }));

    expect(screen.getByRole("menu").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("menuitem", { name: "Rename" }).id,
    );
  });

  it("takes the focus itself so the keyboard reaches the rows", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu").getAttribute("tabindex")).toBe("0");
  });

  it("stands on the rung of the menu it opened from, one step up", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.style.getPropertyValue("--menu-depth"))).toStrictEqual([
      "0",
      "1",
    ]);
  });

  it("marks itself nested only where a menu opened it", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.dataset["nested"])).toStrictEqual([undefined, ""]);
  });

  it("says which side the machine placed it on", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "content").dataset["side"]).toBe("bottom");
  });

  it("is hidden while the menu is shut", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "menu", "content").hasAttribute("hidden")).toBe(true);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<Content as="section" />));

    expect(slotElement(container, "menu", "content").tagName).toBe("SECTION");
  });
});
