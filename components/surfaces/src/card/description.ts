/**
 * Renders the line under a card's title.
 *
 * @remarks
 *   The element is a `p` in `fg.muted` at `body.sm`, in the header grid's second column. The
 *   theme's contrast gate requires at least 4.5:1 for `fg.muted` on the panel.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the description slot under the title.
 */
export const Description = withContext("p", "description");

/**
 * Describes the props of `Description`: the props of a `p`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
