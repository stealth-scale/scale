/**
 * Renders the bar at the top of the panel with the title at the start and the controls at the end.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Renders the header slot as one row above the code.
 */
export const Header = withContext("div", "header");

/**
 * Describes the props of `Header`: the props of the styled `div`.
 */
export type HeaderProps = ComponentProps<typeof Header>;
