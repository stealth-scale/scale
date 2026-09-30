/**
 * Renders the library's button as an anchor, which a toolbar link renders through.
 *
 * @remarks
 *   The button sets `type="button"` by default. An anchor's `type` names the target's media type,
 *   so the anchor leaves the attribute out.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

/**
 * Renders an `a` element with the classes of the library's button.
 *
 * @param props - The props of the library's button and the anchor's target.
 * @returns The `a` element.
 */
export function Anchor(props: ButtonProps): ReactElement {
  return <Button as="a" {...props} type={undefined} />;
}
