/**
 * Renders the supporting text of an alert, after its title.
 *
 * @remarks
 *   The default element is a `span`, so that the `inline` layout can set the title and the
 *   description on one line without nesting block content inside a flex row; a description that
 *   contains paragraphs takes `as="div"`. The text colour is inherited from the root rather than
 *   dropped to the muted token, because the root already paints a palette fill and the inherited
 *   foreground is the one the contrast gate measured against it. Muting it would take a `solid`
 *   alert below the ratio the gate cleared.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the body text of an alert.
 */
export const Description = withContext("span", "description");

/**
 * The props of a styled `span`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
