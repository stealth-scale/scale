/**
 * Draws a block that stands in for content, so a specimen of a layout has something to arrange.
 */

import { type ComponentProps } from "react";

import { withContext } from "#tile/context.ts";

/**
 * Draws one tile, holding whatever it is given.
 */
export const Tile = withContext("div");

/**
 * Describes what a tile takes: everything a styled div element takes.
 */
export type TileProps = ComponentProps<typeof Tile>;
