/**
 * Renders the rule between two nav blocks.
 *
 * @remarks
 *   The separator is the layout package's divider bound to a slot of the sidebar, so its margin
 *   follows the sidebar's size. It keeps the `separator` role of the `hr` element, because the rule
 *   groups the destinations for screen readers too. Pass `aria-hidden` for a rule that is
 *   decoration only.
 */

import { type ComponentProps } from "react";

import { Divider } from "@stealthscale/component-layout";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the divider at the sidebar's size.
 */
export const Separator = withContext(Divider, "separator");

/**
 * Describes the props of `Separator`.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
