/**
 * Renders the controls of an attachment, such as download and remove.
 *
 * @remarks
 *   Name each control by its file, such as "Remove invoice.pdf": a list of buttons that all read
 *   "Remove" says nothing about which file each one removes. On a tile the actions are placed over
 *   the media's top corner.
 */

import { type ComponentProps } from "react";

import { withContext } from "#attachment/context.ts";

/**
 * Renders the actions' `div`.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes the props of `Actions`.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
