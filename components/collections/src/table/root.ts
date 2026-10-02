/**
 * Renders the `table` element.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `table` with the table's root class.
 */
export const Root = withContext("table", "root");

/**
 * Describes the props of the table: the props of a `table`.
 */
export type RootProps = ComponentProps<typeof Root>;
