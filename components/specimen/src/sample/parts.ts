/**
 * Draws the parts of a sample: the cell, the line that names it, and the box the drawing sits in.
 *
 * @remarks
 *   The line that names the sample is bound to the library's paragraph rather than to a div, so
 *   the slot's styles and the caption's text are one element. The caption's size and ink are the
 *   part's own defaults, which a specimen never states.
 */

import { type ComponentProps } from "react";

import { Text } from "@stealthscale/component-typography";

import { CAPTION } from "#caption.tsx";
import { withContext, withProvider } from "#sample/context.ts";

/**
 * Draws the cell, and states how the box below it is drawn and where the drawing sits in it.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what the root takes: everything a styled div element takes, and the sample's axes.
 */
export type RootProps = ComponentProps<typeof Root>;

/**
 * Draws the line that names the sample, above the box.
 */
export const Head = withContext(Text, "caption", { defaultProps: CAPTION });

/**
 * Draws the box the component is shown in.
 */
export const Body = withContext("div", "body");
