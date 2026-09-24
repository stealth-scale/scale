/**
 * Renders the rule between two sets of controls.
 *
 * @remarks
 *   The rule is the layout package's divider, vertical and stretched to the row's height. The
 *   divider sets `aria-orientation` from its orientation. The rule keeps the `separator` role,
 *   because it groups the controls for a screen reader. Set `aria-hidden` on a rule that only
 *   spaces the controls.
 */

import { type ComponentProps } from "react";

import { Divider } from "@stealthscale/component-layout";

import { withContext } from "#toolbar/context.ts";

/**
 * Renders the vertical divider with the recipe's separator class.
 */
export const Separator = withContext(Divider, "separator", {
  defaultProps: { orientation: "vertical" },
});

/**
 * Describes the props of the separator: the props of a divider.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
