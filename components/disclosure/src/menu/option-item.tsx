/**
 * Draws a row that carries a choice: a tick a reader turns on and off, or one of a set.
 *
 * @remarks
 *   The machine gives it the checkbox or the radio menu item role and reports its state to a screen
 *   reader, so a reader hears whether the row is on before choosing it. The row is drawn inset
 *   whichever way the menu is set, because a list whose rows step sideways as their marks appear is
 *   harder to read than one that leaves the room all along.
 *   Which of the two it is, and whether it is on, stay the caller's: the machine reports a change
 *   and the caller decides what that means, which is what lets one radio set clear the rest.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { ItemProvider, useMenu } from "#menu/machine.ts";
import { type Tone } from "#menu/tone.ts";

/**
 * Draws the row at the size the root states, in the same slot as a plain row.
 */
const Chosen = withContext("div", "item");

/**
 * Describes what a row carrying a choice takes.
 */
export interface OptionItemProps extends Omit<ComponentProps<typeof Chosen>, "onSelect"> {
  /**
   * Whether the row is on.
   */
  readonly checked: boolean;

  /**
   * Whether choosing the row closes the menu.
   *
   * @remarks
   *   One of a set closes it, because that choice is finished. A tick leaves it open, because a
   *   reader turning one often turns another. Either is overridden here.
   */
  readonly closeOnSelect?: boolean | undefined;

  /**
   * Whether a reader can choose the row at all.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Tells the caller the reader turned the row on or off.
   */
  readonly onCheckedChange?: ((checked: boolean) => void) | undefined;

  /**
   * The purpose of the row, which decides the ink it is drawn in.
   */
  readonly tone?: Tone | undefined;

  /**
   * Whether the row stands on its own or is one of a set.
   */
  readonly type: "checkbox" | "radio";

  /**
   * The value the machine identifies the row by and reports when the reader chooses it.
   */
  readonly value: string;

  /**
   * The words typeahead matches the row on, where they differ from what it shows.
   */
  readonly valueText?: string | undefined;
}

/**
 * Offers one thing a reader can turn on.
 *
 * @param props - The choice the row carries, beside everything a styled div takes.
 * @returns The row, carrying what the machine writes onto it.
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
