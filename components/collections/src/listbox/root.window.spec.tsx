import { type ReactElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Content } from "#listbox/content.tsx";
import { ItemText } from "#listbox/item-text.tsx";
import { Item } from "#listbox/item.tsx";
import { Root, type RootProps } from "#listbox/root.tsx";
import { COLLECTION, ROWS } from "#listbox/rows.fixtures.ts";
import { Window } from "#listbox/window.tsx";

/**
 * Row height of the windowed list, in pixels.
 */
const ROW = 40;

/**
 * Renders a list whose rows render through a window.
 *
 * @param props - The props of the root.
 * @returns The list.
 */
function windowed(props: Omit<RootProps, "collection"> = {}): ReactElement {
  return (
    <Root aria-label="Places" collection={COLLECTION} {...props}>
      <Content>
        <Window count={ROWS.length} rowHeight={ROW}>
          {({ first, last }) =>
            ROWS.slice(first, last).map((row) => (
              <Item item={row} key={row.value}>
                <ItemText item={row}>{row.label}</ItemText>
              </Item>
            ))
          }
        </Window>
      </Content>
    </Root>
  );
}

describe("Root", () => {
  it("scrolls through the window's function on an arrow key", async () => {
    await drawn(windowed());

    const list = screen.getByRole("listbox");
    const went = vi.spyOn(list, "scrollTo").mockImplementation(() => {});

    fireEvent.keyDown(list, { key: "ArrowDown" });
    await settled();

    expect(went).toHaveBeenCalled();
  });

  it("calls the caller's scrollToIndexFn over the window's", async () => {
    const reached = vi.fn<(details: { index: number }) => void>();

    await drawn(windowed({ scrollToIndexFn: reached }));

    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });
    await settled();

    expect(reached).toHaveBeenCalled();
  });

  it("renders every row in the window's range", () => {
    render(windowed());

    expect(screen.getAllByRole("option")).toHaveLength(ROWS.length);
  });
});
