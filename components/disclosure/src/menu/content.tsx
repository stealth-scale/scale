/**
 * Renders the menu's panel of rows.
 *
 * @remarks
 *   The panel contains the primitives package's scroll area, whose viewport is the element with
 *   `role="menu"`. The machine sets its `aria-activedescendant` and its tab stop, keeps focus on
 *   it, and scrolls a row the keys highlight into view in it: the arrows move the highlight, the
 *   arrow towards a submenu opens it, typing matches a row, and Escape closes the menu and returns
 *   focus to the trigger. The panel sets `--menu-depth` to its depth in the nest, which the recipe
 *   adds to its z-index, and `data-nested` when a menu is above it. The panel remains shown while
 *   its exit animation runs, and the positioner around it renders nothing while the panel is out of
 *   the document. The scroll area follows the menu's direction. A `Menu.Arrow` child renders before
 *   the scroll area, so it is placed against the positioner. The caller's `as` and `style` go to
 *   the panel, and every other prop to the element with `role="menu"`.
 */

import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { Arrow } from "#menu/arrow.tsx";
import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";
import { MENU_DEPTH, NESTED } from "#menu/recipe.ts";

/**
 * Renders the `div` with the menu's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Renders the scroll area's viewport with the menu's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the scroll area's content with the menu's rows class, which pads the rows.
 */
const Rows = withContext(ScrollArea.Content, "rows");

/**
 * Describes the props of the panel: the props of a `div`, without `ref`, which the presence takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Returns whether a child is the menu's arrow, which renders outside the scroll area.
 */
function arrowed(child: ReactNode): boolean {
  return isValidElement(child) && child.type === Arrow;
}

/**
 * Renders the panel with the presence props, the machine's direction, placement and side, its
 * depth and its nested mark, and the rows inside a scroll area whose viewport takes the machine's
 * content props.
 *
 * @param props - The panel's `as` and `style`, and the props of the element with `role="menu"`.
 * @returns The `div` element of the panel.
 */
export function Content({ as, children, style, ...rest }: ContentProps): ReactElement {
  const { api, depth, dir, presence } = useMenu();
  const { props: presented, setNode } = presence;
  const { hidden: _hidden, ...machine } = api.getContentProps();
  const id: unknown = machine["id"];
  const placement: unknown = machine["data-placement"];
  const side: unknown = machine["data-side"];
  const placed: Record<string, unknown> = {
    "data-placement": placement,
    "data-side": side,
    [NESTED]: depth === 0 ? undefined : "",
  };
  const raised: Record<string, string> = { [MENU_DEPTH]: String(depth) };
  const directed = dir === undefined ? {} : { dir };
  const all = Children.toArray(children);

  return (
    <Drawn
      {...presented}
      {...(as === undefined ? {} : { as })}
      {...directed}
      {...placed}
      ref={setNode}
      style={{ ...raised, ...style }}
    >
      {all.filter((child) => arrowed(child))}
      <ScrollArea.Root {...directed} ids={{ viewport: String(id) }}>
        <Viewport focusable="none" {...mergeProps(machine, rest)}>
          <Rows>{all.filter((child) => !arrowed(child))}</Rows>
        </Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Drawn>
  );
}
