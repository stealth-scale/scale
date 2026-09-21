/**
 * Renders the trailing slot of an alert, against its inline end.
 *
 * @remarks
 *   The element is a `div` holding whatever the user can act on: a dismiss control, a link to the
 *   failing resource, a retry. Labelling such a control is the caller's responsibility and the
 *   label should name its target, because a screen reader user moving from control to control
 *   encounters `Dismiss` with none of the surrounding context that would disambiguate it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the trailing region of an alert, centred across the row and sized to its own contents.
 */
export const Aside = withContext("div", "aside");

/**
 * The props of a styled `div`.
 */
export type AsideProps = ComponentProps<typeof Aside>;
