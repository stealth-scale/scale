/**
 * Renders the button in the panel's top corner that closes the drawer.
 *
 * @remarks
 *   The machine sets no accessible name, so the button takes `aria-label`. The glyph is the
 *   caller's, rendered as the button's child. The button is centred on the title's first line, with
 *   its glyph on the panel's padding edge. Escape closes the drawer as well.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useDrawer } from "#drawer/machine.ts";

/**
 * Renders the `button` with the drawer's close trigger class.
 */
const Drawn = withContext("button", "closeTrigger");

/**
 * Describes the props of the close trigger: the props of a `button`, with the accessible name
 * required.
 */
export interface CloseTriggerProps extends ComponentProps<typeof Drawn> {
  /**
   * The accessible name of the button, such as "Close", required because the button shows a glyph
   * and no text.
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
  const api = useDrawer();

  return <Drawn {...mergeProps(api.getCloseTriggerProps(), props)} />;
}
