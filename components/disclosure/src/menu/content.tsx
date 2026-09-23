/**
 * Draws the panel the rows sit in.
 *
 * @remarks
 *   The machine gives it the menu role, points it at the row the reader is on through
 *   `aria-activedescendant`, and keeps the focus here rather than moving it row by row, which is
 *   what the menu pattern asks for. It holds the keyboard: the arrows move the highlight, the arrow
 *   towards a submenu opens it, typing jumps to a row by its words, and Escape closes the menu and
 *   returns the focus to the control that opened it.
 *   It states how deep in a nest it sits, which the recipe adds to the rung every panel stands on,
 *   and marks itself as nested where there is a menu above it. The depth is counted at run time, so
 *   it is written on the element rather than into the stylesheet; the mark is written beside it,
 *   because a rule can ask whether an attribute is there and cannot ask whether a number is more
 *   than nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";
import { MENU_DEPTH, NESTED } from "#menu/recipe.ts";

/**
 * Draws the panel at the size the root states.
 */
const Drawn = withContext("div", "content");

/**
 * Describes what the panel takes.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Shows the rows of the menu.
 *
 * @param props - Everything a styled div takes.
 * @returns The panel, carrying what the machine writes onto it.
 */
export function Content({ style, ...rest }: ContentProps): ReactElement {
  const { api, depth } = useMenu();
  const raised: Record<string, string> = { [MENU_DEPTH]: String(depth) };

  return (
    <Drawn
      {...mergeProps(api.getContentProps(), rest)}
      {...{ [NESTED]: depth === 0 ? undefined : "" }}
      style={{ ...raised, ...style }}
    />
  );
}
