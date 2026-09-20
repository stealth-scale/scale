/**
 * Draws the parts of a device, each bound to its slot of the recipe.
 */

import { type ComponentProps } from "react";

import { withContext, withProvider } from "#device/context.ts";

/**
 * Draws the root, which stacks the bar over the stage.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what the root takes.
 */
export type RootProps = ComponentProps<typeof Root>;

/**
 * Draws the bar: the pickers, and the size at the end.
 */
export const Bar = withContext("div", "bar");

/**
 * Draws one picker: a caption and the switcher beside it.
 */
export const Picker = withContext("div", "picker");

/**
 * Draws the size at the end of the bar.
 */
export const Size = withContext("div", "size");

/**
 * Draws the stage, which holds the frame and scrolls across where the device is wider.
 */
export const Stage = withContext("div", "stage");

/**
 * Draws the frame, which is the window.
 */
export const Frame = withContext("iframe", "frame");
