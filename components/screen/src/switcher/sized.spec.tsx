import { describe, expect, it } from "vitest";

import { Menu } from "@stealthscale/component-disclosure";
import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { Sized } from "#switcher/sized.tsx";

describe("Sized", () => {
  it("draws the menu at the step it is handed", async () => {
    const { container } = await drawn(
      <Sized open step="sm">
        <Menu.Trigger>Workspace</Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="acme">Acme</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Sized>,
    );

    expect(slotClasses(container, "menu", "content")).toContain(
      variantClass(slotClass("menu", "content"), "size", "sm"),
    );
  });
});
