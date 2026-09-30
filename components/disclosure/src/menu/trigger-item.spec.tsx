import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { listed, nested } from "#menu/menu.fixtures.tsx";
import { TriggerItem } from "#menu/trigger-item.tsx";

describe("TriggerItem", () => {
  it("renders a button", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));

    expect(slotElement(container, "menu", "triggerItem").tagName).toBe("BUTTON");
  });

  it("sets role menuitem", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" })).toBeDefined();
  });

  it("sets aria-haspopup menu", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("sets aria-controls to the submenu's id", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }, { lazyMount: false }));
    const panels = [...container.querySelectorAll("[data-scope=menu][data-part=content]")];

    expect(screen.getByRole("menuitem", { name: "Share" }).getAttribute("aria-controls")).toBe(
      panels[1]?.id,
    );
  });

  it("throws in a menu without a parent", async () => {
    await expect(drawn(listed(<TriggerItem>Share</TriggerItem>))).rejects.toThrow(
      "Menu.TriggerItem was drawn in a menu that opens from no other menu.",
    );
  });
});
