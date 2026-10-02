import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Item } from "#menu/index.ts";
import { type ValueChangeDetails } from "#menubar/bar.ts";
import { Content, Menu, Root, Trigger } from "#menubar/index.ts";
import { bar, expanded, keyed, named } from "#menubar/menubar.fixtures.tsx";

async function highlightedShare(): Promise<HTMLElement> {
  const panel = screen.getByRole("menu");

  await keyed(panel, "ArrowDown");
  await keyed(panel, "ArrowDown");
  await keyed(panel, "ArrowDown");

  return panel;
}

describe("Content", () => {
  it("opens the next menu on ArrowRight in a panel", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(screen.getByRole("menu"), "ArrowRight");

    expect(expanded("Edit")).toBe("true");
  });

  it("closes the menu a step leaves", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(screen.getByRole("menu"), "ArrowRight");

    expect(expanded("File")).toBe("false");
  });

  it("opens the previous menu on ArrowLeft in a panel", async () => {
    await drawn(bar({ defaultValue: "edit" }));
    await keyed(screen.getByRole("menu"), "ArrowLeft");

    expect(expanded("File")).toBe("true");
  });

  it("opens the first menu on ArrowRight in the last menu's panel", async () => {
    await drawn(bar({ defaultValue: "view" }));
    await keyed(screen.getByRole("menu"), "ArrowRight");

    expect(expanded("File")).toBe("true");
  });

  it("keeps the last menu open on ArrowRight when loop is false", async () => {
    await drawn(bar({ defaultValue: "view", loop: false }));
    await keyed(screen.getByRole("menu"), "ArrowRight");

    expect(expanded("View")).toBe("true");
  });

  it("opens the next menu on ArrowLeft in a right-to-left bar", async () => {
    await drawn(bar({ defaultValue: "file", dir: "rtl" }));
    await keyed(screen.getByRole("menu"), "ArrowLeft");

    expect(expanded("Edit")).toBe("true");
  });

  it("highlights the first row of the menu a step opens", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(screen.getByRole("menu"), "ArrowRight");

    expect(screen.getByRole("menu").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("menuitem", { name: "Undo" }).id,
    );
  });

  it("highlights no row of a menu a press opens", async () => {
    await drawn(bar());
    await pressed(screen.getByRole("menuitem", { name: "Edit" }));

    expect(screen.getByRole("menu").getAttribute("aria-activedescendant")).toBeNull();
  });

  it("opens the submenu on ArrowRight while its row is highlighted", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(await highlightedShare(), "ArrowRight");

    expect(screen.getByRole("menuitem", { name: "Copy link" })).toBeDefined();
  });

  it("keeps its menu open on ArrowRight while a submenu row is highlighted", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(await highlightedShare(), "ArrowRight");

    expect(expanded("File")).toBe("true");
  });

  it("opens the previous menu on ArrowLeft while a submenu row is highlighted", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(await highlightedShare(), "ArrowLeft");

    expect(expanded("View")).toBe("true");
  });

  it("leaves the bar to the submenu on an arrow in the submenu's panel", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(await highlightedShare(), "ArrowRight");
    await keyed(screen.getAllByRole("menu")[1] ?? document.body, "ArrowRight");

    expect(expanded("File")).toBe("true");
  });

  it("closes the menu on Tab in its panel", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(screen.getByRole("menu"), "Tab");

    expect(expanded("File")).toBe("false");
  });

  it("moves focus to the menu's name on Tab in its panel", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(screen.getByRole("menu"), "Tab");

    expect(document.activeElement).toBe(named("File"));
  });

  it("closes the menu on Tab in a submenu's panel", async () => {
    await drawn(bar({ defaultValue: "file" }));
    await keyed(await highlightedShare(), "ArrowRight");
    await keyed(screen.getAllByRole("menu")[1] ?? document.body, "Tab");

    expect(expanded("File")).toBe("false");
  });

  it("calls the caller's onKeyDownCapture", async () => {
    const captured = vi.fn<() => void>();

    await drawn(
      <Root aria-label="Editor" defaultValue="file">
        <Menu value="file">
          <Trigger>File</Trigger>
          <Content onKeyDownCapture={captured}>
            <Item value="new">New</Item>
          </Content>
        </Menu>
      </Root>,
    );
    await keyed(screen.getByRole("menu"), "ArrowDown");

    expect(captured).toHaveBeenCalledOnce();
  });

  it("leaves the arrows to the menus in the folded bar's menu", async () => {
    const told = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(bar({ onValueChange: told }));
    await pressed(screen.getByRole("button", { name: "Menu" }));
    await pressed(within(screen.getByRole("menu")).getByRole("menuitem", { name: "File" }));
    await keyed(screen.getAllByRole("menu")[1] ?? document.body, "ArrowRight");

    expect(told).not.toHaveBeenCalled();
  });
});
