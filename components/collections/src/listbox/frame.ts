/**
 * Draws the box the list is read in: the field above the rows, the row that turns all of them on,
 * the rows themselves, and the line the list says when it holds none.
 *
 * @remarks
 *   The surface is here rather than on the list, because the element carrying `role="listbox"`
 *   admits an option and a group and nothing else. A field drawn inside it is markup a screen
 *   reader is entitled to ignore, and a field drawn outside the box it narrows is a field that
 *   looks like it belongs to something else. The box holds both apart: the field stands inside it
 *   and outside the list.
 *   It hides its overflow, which is what cuts the rows back to its corner. The rows scroll inside
 *   the list rather than here, so the field and the row above them stay put while the rows move.
 *   The label above the box and the summary below it stay outside, because neither is part of what
 *   a reader is choosing from.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Draws the box at the room and the look the list states.
 */
export const Frame = withContext("div", "frame");

/**
 * Describes what the box takes: everything a styled div element takes.
 */
export type FrameProps = ComponentProps<typeof Frame>;
