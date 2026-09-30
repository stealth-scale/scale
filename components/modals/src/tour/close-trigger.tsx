/**
 * Renders the button in the card's top corner that ends the tour.
 *
 * @remarks
 *   The button takes `aria-label`, because it shows a glyph and no text. The caller's name replaces
 *   the machine's. The glyph is the caller's, rendered as the button's child. The button is centred
 *   on the title's first line, with its glyph on the card's padding edge. Escape ends the tour as
 *   well.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `button` with the tour's close trigger class.
 */
const Drawn = withContext("button", "closeTrigger");

/**
 * Describes the props of the close trigger: the props of a `button`, with the accessible name
 * required.
 */
export interface CloseTriggerProps extends ComponentProps<typeof Drawn> {
  /**
   * The accessible name of the button, such as "End the tour", required because the button shows a
   * glyph and no text.
   */
  readonly "aria-label": string;
}

/**
 * Renders the close trigger with the machine's close trigger props merged over the caller's.
 *
 * @param props - The accessible name and the props of a `button`.
 * @returns The `button` element.
 */
export function CloseTrigger(props: CloseTriggerProps): ReactElement {
  const api = useTourContext();

  return <Drawn {...mergeProps(api.getCloseTriggerProps(), props)} />;
}
