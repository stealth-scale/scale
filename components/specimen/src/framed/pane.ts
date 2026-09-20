/**
 * Draws the box a framed scene is drawn in, which meets the window's edges the way the scene
 * meets its card on the page.
 */

import { type ComponentProps } from "react";

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#framed/pane.recipe.ts";

/**
 * The binder that draws the pane recipe on an element.
 */
const { withContext } = createRecipeContext(recipe);

/**
 * Draws one pane, holding the scene at the frame its scene names.
 */
export const Pane = withContext("div");

/**
 * Describes what a pane takes: the frame, and everything a styled div element takes.
 */
export type PaneProps = ComponentProps<typeof Pane>;
