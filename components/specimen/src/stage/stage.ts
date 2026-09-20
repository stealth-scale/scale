/**
 * Draws the box a scene is drawn in, held to a window's width where one is picked.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stage/context.ts";

/**
 * Draws one stage, holding the scene at the width its axis names, or the card's.
 */
export const Stage = withContext("div");

/**
 * Describes what a stage takes: a window's width, and everything a styled div element takes.
 */
export type StageProps = ComponentProps<typeof Stage>;
