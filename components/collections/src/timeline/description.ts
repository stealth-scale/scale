/**
 * Renders the supporting text of an entry, in the muted ink below its title.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the description `div`.
 */
export const Description = withContext("div", "description");

/**
 * Describes the props of `Description`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
