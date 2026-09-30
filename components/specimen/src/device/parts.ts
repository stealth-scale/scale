/**
 * Draws the parts of a device, each bound to its slot of the recipe.
 *
 * @remarks
 *   The stage composes the primitives package's scroll area, which the module passes on with the
 *   parts, so the device draws the stage's viewport and bar from one import.
 */

import { type ComponentProps } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext, withProvider } from "#device/context.ts";

export { ScrollArea } from "@stealthscale/component-primitives";

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
 * Draws the stage, the primitives package's scroll area, which holds the frame and scrolls across
 * where the device is wider.
 */
export const Stage = withContext(ScrollArea.Root, "stage");

/**
 * Draws the stage's content, which keeps the room round the frame its outline is drawn in.
 */
export const Content = withContext(ScrollArea.Content, "content");

/**
 * Draws the frame, which is the window.
 */
export const Frame = withContext("iframe", "frame");
