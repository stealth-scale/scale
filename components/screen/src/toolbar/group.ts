/**
 * Renders controls pressed together in the row: the layout package's group, attached.
 *
 * @remarks
 *   Each control in the group is a roving item, so the group keeps the row's one tab stop and its
 *   arrow keys. Bold, italic and underline are the usual case. The group does not shrink, because a
 *   joined control that wraps has squared corners facing no neighbour.
 */

import { type ComponentProps } from "react";

import * as Layout from "@stealthscale/component-layout";

import { withContext } from "#toolbar/context.ts";

/**
 * Renders the layout package's group, attached, with the recipe's group class.
 */
export const Group = withContext(Layout.Group, "group", { defaultProps: { attached: true } });

/**
 * Describes the props of the group: the props of the layout package's group.
 */
export type GroupProps = ComponentProps<typeof Group>;
