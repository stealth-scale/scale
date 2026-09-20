/**
 * Draws a box held to one of the page's measures, so a specimen can show what a component does
 * when it runs out of width.
 */

import { type ComponentProps } from "react";

import { withContext } from "#room/context.ts";

/**
 * Draws one room, holding whatever it is given at the measure its size names.
 */
export const Room = withContext("div");

/**
 * Describes what a room takes: the measure, and everything a styled div element takes.
 */
export type RoomProps = ComponentProps<typeof Room>;
