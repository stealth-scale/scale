/**
 * Renders the text input a person types into and walks the rows from.
 *
 * @remarks
 *   The element is an `input` with `role="combobox"`. Focus stays on it while the panel is open,
 *   and `aria-activedescendant` points at the highlighted row. It is named by `Combobox.Label`,
 *   else by the label of a field around the combobox, else by the caller's `aria-label`, which it
 *   reports to the root for the panel. Inside a field it is described by the field's helper and
 *   error texts. Typing opens the panel, the arrow keys open it and move the highlight, Enter picks
 *   the highlighted row, and Escape closes the panel, then restores the value's text. Emptying the
 *   text of a single combobox clears its value. Leaving the input with a text that matches no pick
 *   restores the value's text, unless custom values are allowed. The hidden select takes `name` and
 *   `required`, and the input reports `aria-required`. While custom values are allowed, the input
 *   takes both and a form submits the text.
 */

import { type ChangeEvent, type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";
import { useNamed, useShared } from "#combobox/state.ts";

/**
 * Renders the `input` with the combobox's input class.
 */
const Typed = withContext("input", "input");

/**
 * Describes the props of the input: the props of an `input`.
 */
export type InputProps = ComponentProps<typeof Typed>;

/**
 * Renders the input with the machine's input props, named and described as the root shares, and
 * reports the caller's `aria-label` to the root.
 *
 * @param props - The attributes of the text field, which may include its `aria-label`.
 * @returns The `input` element with `role="combobox"`.
 */
export function Input(props: InputProps): ReactElement {
  const api = useCombobox();
  const { custom, describedBy, emptied, settle } = useShared();

  useNamed(props["aria-label"]);

  const { name, required, ...machine }: InputProps = { ...api.getInputProps() };
  const submitted = custom
    ? omitUndefined({ name, required })
    : omitUndefined({ "aria-required": required === true ? true : undefined });
  const own = {
    ...omitUndefined({ "aria-describedby": describedBy }),
    onBlur: settle,
    onChange: (event: ChangeEvent<HTMLInputElement>): void => {
      emptied(event.currentTarget.value);
    },
  };

  return <Typed {...mergeProps(machine, submitted, own, props)} />;
}
