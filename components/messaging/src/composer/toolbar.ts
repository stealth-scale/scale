/**
 * Renders the row of controls under the text: attach, the caller's own controls, and submit at the
 * end.
 */

import { type ComponentProps } from "react";

import { withContext } from "#composer/context.ts";

/**
 * Renders the row's `div`.
 */
export const Toolbar = withContext("div", "toolbar");

/**
 * Describes the props of `Toolbar`.
 */
export type ToolbarProps = ComponentProps<typeof Toolbar>;
