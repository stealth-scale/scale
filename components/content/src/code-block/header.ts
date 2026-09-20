/**
 * Draws the row across the top of the panel, holding the title and the control.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Draws the row at the size the root states.
 */
export const Header = withContext("div", "header");

/**
 * Describes what the header takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
