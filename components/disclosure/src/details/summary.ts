/**
 * Renders the `summary` that names the details and opens and closes it.
 *
 * @remarks
 *   The browser gives the summary its role, its name from its text and its expanded state, and
 *   opens it on a press, Enter and Space. It is the first child of the root.
 */

import { type ComponentProps } from "react";

import { withContext } from "#details/context.ts";

/**
 * Renders the `summary` with the details' summary class.
 */
export const Summary = withContext("summary", "summary");

/**
 * Describes the props of the summary: the props of a `summary`.
 */
export type SummaryProps = ComponentProps<typeof Summary>;
