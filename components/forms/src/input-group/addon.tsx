/**
 * Renders an addon inside the input group.
 *
 * @remarks
 *   An addon is a segment at its own width, such as a protocol, a domain or a country code. At
 *   either end of the group it reaches the box's edge and takes the box's corners. A divider in the
 *   field's edge color separates it from the fields, with a field inset beyond it. `look` sets its
 *   fill: `filled` takes the surface one step darker than the box, and `plain` has no fill. It can
 *   contain text, a `select` rendered as a group field, or a button.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Renders a `div` with the group's addon class.
 */
const Segment = withContext("div", "addon");

/**
 * Describes the props of an addon: its look and the props of a `div` element.
 */
export interface AddonProps extends ComponentProps<typeof Segment> {
  /**
   * Fill of the addon. Defaults to `filled`.
   */
  readonly look?: "filled" | "plain" | undefined;
}

/**
 * Renders the addon with its look written to `data-look`.
 */
export function Addon({ look = "filled", ...props }: AddonProps): ReactElement {
  return <Segment data-look={look} {...props} />;
}
