/**
 * Renders a checkable row: a checkbox, or one radio of a set.
 *
 * @remarks
 *   The machine sets `role="menuitemcheckbox"` or `role="menuitemradio"` and `aria-checked`. The
 *   checked state is the caller's: the machine reports a change through `onCheckedChange`, and the
 *   caller clears the other radios of a set. A radio closes the menu on select and a checkbox keeps
 *   it open. `closeOnSelect` overrides either.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { ItemProvider, useMenu } from "#menu/machine.ts";
import { type Tone } from "#menu/tone.ts";

/**
 * Renders the `div` with the menu's item class.
 */
const Chosen = withContext("div", "item");

/**
 * Describes the props of a checkable row: its checked state, its type, its value and the props of a
 * `div`.
 */
export interface OptionItemProps extends Omit<ComponentProps<typeof Chosen>, "onSelect"> {
  /**
   * Whether the row is checked.
   */
  readonly checked: boolean;

  /**
   * Whether choosing the row closes the menu. Defaults to true for a radio and false for a
   * checkbox.
   */
  readonly closeOnSelect?: boolean | undefined;

  /**
   * Whether the row is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Called with the new checked state when the row is chosen.
   */
  readonly onCheckedChange?: ((checked: boolean) => void) | undefined;

  /**
   * Tone of the row, which sets its palette.
   */
  readonly tone?: Tone | undefined;

  /**
   * Whether the row is a checkbox or a radio.
   */
  readonly type: "checkbox" | "radio";

  /**
   * Value the machine identifies the row by and reports when it is chosen.
   */
  readonly value: string;

  /**
   * Text typeahead matches, when it differs from the rendered text.
   */
  readonly valueText?: string | undefined;
}

/**
 * Renders the row with the machine's option item props and `data-tone`, and provides its state.
 *
 * @param props - The row's checked state, type, value, options, tone and the props of a `div`.
 * @returns The `div` element inside the item provider.
 */
export function OptionItem({
  checked,
  closeOnSelect,
  disabled,
  onCheckedChange,
  tone,
  type,
  value,
  valueText,
  ...rest
}: OptionItemProps): ReactElement {
  const { api } = useMenu();
  const state = {
    closeOnSelect: closeOnSelect ?? type === "radio",
    ...(disabled === undefined ? {} : { disabled }),
    ...(onCheckedChange === undefined ? {} : { onCheckedChange }),
    ...(valueText === undefined ? {} : { valueText }),
    checked,
    type,
    value,
  };

  return (
    <ItemProvider value={state}>
      <Chosen {...mergeProps(api.getOptionItemProps(state), { "data-tone": tone }, rest)} />
    </ItemProvider>
  );
}
