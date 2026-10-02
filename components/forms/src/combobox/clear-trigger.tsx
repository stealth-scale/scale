/**
 * Renders the button that clears the value.
 *
 * @remarks
 *   The button is the input group's square, placed before the trigger. It is named by `label`, is
 *   `hidden` while nothing is selected, and is out of the tab order, because emptying the text
 *   clears the value from the keyboard. A press clears the value and the text, closes the panel and
 *   keeps focus on the input. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `button` with the combobox's clear trigger class.
 */
const Cleared = withContext("button", "clearTrigger");

/**
 * Describes the props of the clear trigger: its name, its glyph and the props of a `button`.
 */
export interface ClearTriggerProps extends ComponentProps<typeof Cleared> {
  /**
   * Accessible name of the button. Defaults to `Clear value`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the clear trigger with the machine's clear trigger props, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element, hidden while nothing is selected.
 */
export function ClearTrigger({ label = "Clear value", ...props }: ClearTriggerProps): ReactElement {
  const api = useCombobox();

  return <Cleared {...mergeProps(api.getClearTriggerProps(), { "aria-label": label }, props)} />;
}
