/**
 * Renders a key of a chart's marks: a list of each part's glyph and name, for a chart read by
 * convention, such as a box plot.
 *
 * @remarks
 *   The key explains the parts of the marks, not the series, so it takes no press. It renders
 *   outside the plot, below it, as the legend does. `KeyItem` renders each entry.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#chart/context.ts";

/**
 * Renders the `ul` with the chart's key class.
 */
const List = withContext("ul", "key");

/**
 * Describes the props of the key: the props of a `ul`.
 */
export type KeyProps = ComponentProps<typeof List>;

/**
 * Renders the list of the key's entries.
 *
 * @param props - The entries and the props of a `ul`.
 */
export function Key(props: KeyProps): ReactElement {
  return <List {...props} />;
}
