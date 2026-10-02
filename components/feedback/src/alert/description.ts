/**
 * Renders the supporting text of the alert after its title.
 *
 * @remarks
 *   The default element is a `span`, so the `inline` layout sets the title and the description on
 *   one line without block content in a flex row. Pass `as="div"` for a description with
 *   paragraphs. The text inherits the root's ink, which the contrast gate measured against the
 *   fill. A muted ink would take a solid alert below that ratio.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders a span in the root's ink.
 */
export const Description = withContext("span", "description");

/**
 * Describes the props of Alert.Description: the props of a span element.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
