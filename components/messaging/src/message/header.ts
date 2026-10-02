/**
 * Renders the row above a turn's bubbles: the sender's name and the time the turn began.
 */

import { type ComponentProps } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the header's `div`.
 */
export const Header = withContext("div", "header");

/**
 * Describes the props of `Header`.
 */
export type HeaderProps = ComponentProps<typeof Header>;
