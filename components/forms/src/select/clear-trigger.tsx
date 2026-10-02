/**
 * Renders the button that clears the value.
 *
 * @remarks
 *   The button is the input group's square, placed at the trigger's end before the indicator. It
 *   is named by `label`, is `hidden` while nothing is selected, and moves focus to the trigger once
 *   it clears the value. The glyph is the caller's. The open panel closes when the button takes
 *   focus, from Tab or a press, because the machine does not count the button as outside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { useSelect } from "#select/machine.ts";
import { useShared } from "#select/state.ts";

/**
 * Renders the `button` with the select's clear trigger class.
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
  const api = useSelect();
  const { dismiss } = useShared();
  const own = {
    "aria-label": label,
    onFocus: (): void => {
      if (api.open) dismiss();
    },
  };

  return <Cleared {...mergeProps(api.getClearTriggerProps(), own, props)} />;
}
