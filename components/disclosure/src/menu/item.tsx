/**
 * Renders one row of the menu.
 *
 * @remarks
 *   The row takes a `value`. The machine sets `role="menuitem"`, the highlight, the disabled state
 *   and the typeahead text. The row provides its state to the text and the indicator inside it, so
 *   a caller sets `value` once.
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
 * Describes the props of a row: its value, its options, its tone and the props of a `div`.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Chosen>, "onSelect"> {
  /**
   * Whether choosing the row closes the menu. Defaults to true.
   */
  readonly closeOnSelect?: boolean | undefined;

  /**
   * Whether the row is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Tone of the row, which sets its palette.
   */
  readonly tone?: Tone | undefined;

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
 * Renders the row with the machine's item props and `data-tone`, and provides its state.
 *
 * @param props - The row's value, options, tone and the props of a `div`.
 * @returns The `div` element inside the item provider.
 */
export function Item({
  closeOnSelect,
  disabled,
  tone,
  value,
  valueText,
  ...rest
}: ItemProps): ReactElement {
  const { api } = useMenu();
  const state = {
    ...(closeOnSelect === undefined ? {} : { closeOnSelect }),
    ...(disabled === undefined ? {} : { disabled }),
    ...(valueText === undefined ? {} : { valueText }),
    value,
  };

  return (
    <ItemProvider value={state}>
      <Chosen {...mergeProps(api.getItemProps(state), { "data-tone": tone }, rest)} />
    </ItemProvider>
  );
}
