/**
 * Renders the bar across the top of the panel that carries the title and the controls.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Lays the title and the controls out on one line above the code.
 */
export const Header = withContext("div", "header");

/**
 * Props accepted by `Header`, which are the props of a styled `div`.
 */
export type HeaderProps = ComponentProps<typeof Header>;
