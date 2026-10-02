/**
 * Renders the row under a turn's bubbles: the delivery status and the actions.
 */

import { type ComponentProps } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the footer's `div`.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes the props of `Footer`.
 */
export type FooterProps = ComponentProps<typeof Footer>;
