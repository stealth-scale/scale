/**
 * Renders the heading that contains an item's trigger.
 *
 * @remarks
 *   The element is an `h3`, and `as` renders another level, so the accordion's headings take their
 *   place in the page's outline and a screen reader lists each trigger among the headings. A child
 *   after the trigger, such as an action button, is placed at the end of the row and outside the
 *   trigger, because a button inside a button has no accessible meaning.
 */

import { type ComponentProps } from "react";

import { withContext } from "#accordion/context.ts";

/**
 * Renders the `h3` with the accordion's item heading class.
 */
export const ItemHeading = withContext("h3", "itemHeading");

/**
 * Describes the props of the item heading: the props of an `h3`.
 */
export type ItemHeadingProps = ComponentProps<typeof ItemHeading>;
