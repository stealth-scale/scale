/**
 * Renders the line under a step's title.
 *
 * @remarks
 *   The element is a `span`, so it fits inside the trigger's `button`. It takes the muted ink and
 *   the body text one size below the steps.
 */

import { type ComponentProps } from "react";

import { withContext } from "#steps/context.ts";

/**
 * Renders the `span` with the steps' description class.
 */
export const Description = withContext("span", "description");

/**
 * Describes the props of the description: the props of a `span`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
