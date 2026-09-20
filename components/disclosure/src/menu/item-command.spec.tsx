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
 * Draws an open menu holding one row that carries a keystroke.
 *
 * @param props - Whatever the case sets on the keys.
 * @returns The menu, open.
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
  it("draws a kbd inside the row it sits at the end of", async () => {
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

  it("is read as part of the row rather than as a row of its own", async () => {
    await drawn(struck());

    expect(screen.getByRole("menuitem", { name: "Release ⌘R" })).toBeDefined();
    expect(screen.getAllByRole("menuitem")).toHaveLength(1);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(struck({ as: "span" }));

    expect(slotElement(container, "menu", "itemCommand").tagName).toBe("SPAN");
  });
});
