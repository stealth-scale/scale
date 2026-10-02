/**
 * Renders the heading that labels a nav block.
 *
 * @remarks
 *   The label takes its `id` from the block, and the block's `aria-labelledby` points at it, so the
 *   label names the block's landmark and the caller writes no identifier. A collapsed sidebar hides
 *   the label visually and keeps it for screen readers.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#sidebar/context.ts";
import { useNav } from "#sidebar/state.ts";

/**
 * Renders the heading `h2` at the sidebar's size.
 */
const Headed = withContext("h2", "navLabel");

/**
 * Describes the props of `NavLabel`, less the `id` the block sets.
 */
export type NavLabelProps = Omit<ComponentProps<typeof Headed>, "id">;

/**
 * Renders the label of a nav block.
 *
 * @param props - The `h2` element's props, less `id`.
 * @returns The heading, with the identifier the block's `aria-labelledby` points at.
 */
export function NavLabel(props: NavLabelProps): ReactElement {
  const nav = useNav();

  return <Headed {...props} id={nav.labelId} />;
}
