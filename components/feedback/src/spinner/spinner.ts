/**
 * Renders a spinner: a turning ring that shows work with no measurable progress.
 *
 * @remarks
 *   The element is an empty `span` with no role, so a screen reader skips it. Write the words the
 *   wait needs beside it, and set `aria-busy` on the region that is waiting. Show a progress
 *   indicator instead where the work reports how far along it is.
 */

import { type ComponentProps } from "react";

import { withContext } from "#spinner/context.ts";

/**
 * Renders a `span` styled by the spinner recipe.
 */
export const Spinner = withContext("span");

/**
 * Combines the recipe's variants with the props of a `span`.
 */
export type SpinnerProps = ComponentProps<typeof Spinner>;
