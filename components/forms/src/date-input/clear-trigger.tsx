/**
 * Renders the button that clears the dates.
 *
 * @remarks
 *   The button is the input group's square at the field's end. It is named by `label`, "Clear date"
 *   by default, and is `hidden` while no date is set and in a read-only input. A press clears the
 *   dates and moves focus to the first segment, because the button hides as the dates clear. The
 *   glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-input/context.ts";
import { useDateInput } from "#date-input/machine.ts";
import { useShared } from "#date-input/state.ts";

/**
 * Renders the `button` with the date input's clear trigger class.
 */
const Cleared = withContext("button", "clearTrigger");

/**
 * Describes the props of the clear trigger: its name, its glyph and the props of a `button`.
 */
export interface ClearTriggerProps extends ComponentProps<typeof Cleared> {
  /**
   * Accessible name of the button. Defaults to `Clear date`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the clear trigger, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element, hidden while no date is set.
 */
export function ClearTrigger({ label = "Clear date", ...props }: ClearTriggerProps): ReactElement {
  const api = useDateInput();
  const { readOnly } = useShared();
  const own: ComponentProps<typeof Cleared> = {
    "aria-label": label,
    disabled: api.disabled,
    hidden: readOnly || api.value.length === 0,
    onClick: (): void => {
      api.clearValue();
      api.focus();
    },
    type: "button",
  };

  return <Cleared {...mergeProps(own, props)} />;
}
