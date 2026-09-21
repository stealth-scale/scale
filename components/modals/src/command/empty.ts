/**
 * Renders the message shown when no action matches the query.
 *
 * @remarks
 *   Word the message so it names what was searched. `No commands match` confirms that the palette
 *   ran a search and came back empty, where `No results` leaves the reader unsure it searched at
 *   all. The list mounts this only while the collection is empty, so the text is present in the
 *   document exactly when it is true and never announced above a list of rows.
 */

import { type ComponentProps } from "react";

import { withContext } from "#command/context.ts";

/**
 * Centres the message across the width of the list.
 */
export const Empty = withContext("p", "empty");

/**
 * Props accepted by `Empty`, which are the props of a styled `p` element.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
