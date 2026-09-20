/**
 * Draws the parts of a sample: the cell, the line that names it, and the box the drawing sits in.
 */

import { type ComponentProps } from "react";

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
export const Head = withContext("div", "caption");

/**
 * Draws the box the component is shown in.
 */
export const Body = withContext("div", "body");
