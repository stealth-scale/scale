import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  Content,
  Item,
  ItemCommand,
  type ItemCommandProps,
  Positioner,
  Root,
  Trigger,
} from "#menu/index.ts";
import { listed } from "#menu/menu.fixtures.tsx";

/**
 * Renders an open menu with one row that ends in a shortcut.
 *
 * @param props - The props the case sets on the shortcut.
 * @returns The open menu.
 */
function struck(props: ItemCommandProps = {}): ReactElement {
  return (
    <Root defaultOpen>
      <Trigger>Actions</Trigger>
      <Positioner>
        <Content>
          <Item value="release">
            Release
            <ItemCommand {...props}>⌘R</ItemCommand>
          </Item>
        </Content>
      </Positioner>
    </Root>
  );
}

describe("ItemCommand", () => {
  it("renders a kbd", async () => {
    const { container } = await drawn(
      listed(
        <Item value="release">
          Release
          <ItemCommand>⌘R</ItemCommand>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemCommand").tagName).toBe("KBD");
  });

  it("joins the row's accessible name", async () => {
    await drawn(struck());

    expect(screen.getByRole("menuitem", { name: "Release ⌘R" })).toBeDefined();
    expect(screen.getAllByRole("menuitem")).toHaveLength(1);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(struck({ as: "span" }));

    expect(slotElement(container, "menu", "itemCommand").tagName).toBe("SPAN");
  });
});
