/**
 * Renders one choice in the picker: a button with a glyph that adds that reaction.
 *
 * @remarks
 *   The element is the actions `Button`, square, small, in the ghost look, named by `label`, with
 *   the glyph hidden from a screen reader. A press reports `value` through the picker's `onSelect`
 *   and closes the picker.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#reactions/context.ts";
import { usePickerState } from "#reactions/state.ts";

/**
 * Renders the `span` around the glyph.
 */
const Glyph = withContext("span", "glyph");

/**
 * Describes the props of a choice: its name, its value, and the props of the actions `Button`.
 */
export interface ChoiceProps extends ButtonProps {
  /**
   * Accessible name of the reaction, such as "Thumbs up".
   */
  readonly label: string;

  /**
   * Value the picker's `onSelect` receives.
   */
  readonly value: string;
}

/**
 * Renders the choice's button.
 *
 * @param props - The name, the value, and the props of the actions `Button`, the glyph among its
 *   children.
 * @returns The `button` element.
 */
export function Choice({ children, label, onClick, value, ...props }: ChoiceProps): ReactElement {
  const { choose } = usePickerState();

  return (
    <Button
      aria-label={label}
      shape="square"
      size="sm"
      variant="ghost"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        choose(value);
      }}
    >
      <Glyph aria-hidden="true">{children}</Glyph>
    </Button>
  );
}
