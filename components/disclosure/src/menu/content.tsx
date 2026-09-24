/**
 * Renders the menu's panel of rows.
 *
 * @remarks
 *   The machine sets `role="menu"` and `aria-activedescendant`, and keeps focus on the panel: the
 *   arrows move the highlight, the arrow towards a submenu opens it, typing matches a row, and
 *   Escape closes the menu and returns focus to the trigger. The panel sets `--menu-depth` to its
 *   depth in the nest, which the recipe adds to its z-index, and `data-nested` when a menu is above
 *   it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";
import { MENU_DEPTH, NESTED } from "#menu/recipe.ts";

/**
 * Renders the `div` with the menu's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the panel: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Renders the panel with the machine's content props, its depth and its nested mark.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
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
