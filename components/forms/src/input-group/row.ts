/**
 * Renders one row of an input group that stacks its items in rows.
 *
 * @remarks
 *   A root that contains rows stacks them and draws a divider in the field's edge color between
 *   them. A row lays out its fields, marks and addons the way a root without rows does, at the same
 *   inset, so a card form puts the number on one row and the expiry and security code on the next.
 *   An addon keeps only the corners it shares with the box. Put every item of such a root inside a
 *   row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Renders a `div` with the group's row class.
 */
export const Row = withContext("div", "row");

/**
 * Describes the props of a row: the props of a `div` element.
 */
export type RowProps = ComponentProps<typeof Row>;
