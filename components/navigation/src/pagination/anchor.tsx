/**
 * Renders the library's `Button` as an `a`, for pages and triggers given as links.
 *
 * @remarks
 *   A part bound to `Button` renders the element its own `as` names in place of the button, so
 *   `as="a"` on the part would drop the button's recipe. This part passes `as` to the button, whose
 *   own binding keeps its classes on the `a`. The button's `type` defaults to `button`, which an
 *   `a` reads as the media type of the page it opens, so this part clears it.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";

import { type LinkProps } from "#pagination/linked.ts";

/**
 * Renders the button as an `a` without a `type`.
 *
 * @param props - The props of a `Button` and the address the link opens.
 * @returns The `a` element with the button's classes.
 */
export function Anchor(props: LinkProps): ReactElement {
  return <Button {...props} as="a" type={undefined} />;
}
