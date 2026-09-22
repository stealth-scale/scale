/**
 * Draws the heading naming one list inside a block of destinations.
 *
 * @remarks
 *   Distinct from `NavLabel`, which names the block itself and carries the identifier the block's
 *   landmark points at. A block holds one label and as many headings as it holds lists, so this
 *   part takes its identifier from the caller and the caller points the list at it with
 *   `aria-labelledby`. Writing the heading without pointing a list at it leaves a heading a reader
 *   hears and a list nobody named, which is the failure worth knowing about.
 *   On a collapsed sidebar the words go out of sight rather than out of the document, as the
 *   block's own label does, so a rail showing marks alone keeps its sections for a screen reader.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the heading at the size the column states.
 */
const Headed = withContext("h2", "navHeading");

/**
 * Describes what a heading takes, the identifier a list names it by among them.
 */
export type NavHeadingProps = ComponentProps<typeof Headed>;

/**
 * Heads one list of destinations inside a block.
 *
 * @param props - Everything a styled heading takes, the identifier among them.
 * @returns The heading, at the size the column states.
 */
export function NavHeading(props: NavHeadingProps): ReactElement {
  return <Headed {...props} />;
}
