/**
 * Renders the message shown when the search matches no destination.
 *
 * @remarks
 *   Name what was searched: `No projects match` tells the reader that the search ran and found
 *   nothing, and `No results` does not. Render the message only while nothing matches. A collapsed
 *   sidebar removes it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the message `p` at the sidebar's size.
 */
export const Empty = withContext("p", "empty");

/**
 * Describes the props of `Empty`.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
