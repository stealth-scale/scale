/**
 * Renders the control at the end of a nav block's label row.
 *
 * @remarks
 *   The control acts on the block, for example to add a project or open its settings. It is a
 *   square in the end column of the navigation list's rows, with a hover fill and the focus ring.
 *   Pass the icon as its child and name the control with `aria-label`: `Add project`, not `Add`. A
 *   collapsed sidebar removes the control, because a rail has no room beside an icon.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the control `button` at the sidebar's size, typed `button` so it submits no form.
 */
export const NavAction = withContext("button", "navAction", {
  defaultProps: { type: "button" },
});

/**
 * Describes the props of `NavAction`.
 */
export type NavActionProps = ComponentProps<typeof NavAction>;
