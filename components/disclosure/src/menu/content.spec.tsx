import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#menu/content.tsx";
import { composed, listed, nested } from "#menu/menu.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<Content />));

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
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.style.getPropertyValue("--menu-depth"))).toStrictEqual([
      "0",
      "1",
    ]);
  });

  it("sets data-nested on a submenu's panel alone", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.dataset["nested"])).toStrictEqual([undefined, ""]);
  });

  it("sets data-side to the machine's placement", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "content").dataset["side"]).toBe("bottom");
  });

  it("sets hidden while closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "menu", "content").hasAttribute("hidden")).toBe(true);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<Content as="section" />));

    expect(slotElement(container, "menu", "content").tagName).toBe("SECTION");
  });
});
