/**
 * Renders the square at a row's start that shows an initial, an icon or an avatar.
 *
 * @remarks
 *   The recipe sizes the square as a tag on `bg.muted`, so every row's mark has one size. The mark
 *   sets `aria-hidden`, because the row's text already gives the row its name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's item mark class, hidden from assistive technology.
 */
const Marked = withContext("span", "itemMark", { defaultProps: { "aria-hidden": true } });

/**
 * Describes the props of a row's mark: the props of a `span`.
 */
export type ItemMarkProps = ComponentProps<typeof Marked>;

/**
 * Renders the mark, and throws when no menu is above it.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemMark(props: ItemMarkProps): ReactElement {
  useMenu();

  return <Marked {...props} />;
}
