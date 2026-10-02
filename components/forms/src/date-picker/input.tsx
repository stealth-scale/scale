/**
 * Renders a text input a person types a date into.
 *
 * @remarks
 *   The machine parses the text on Enter and when the input loses focus, in the root's `locale`
 *   and with its `parse`, and writes the dates back in its `format`, `09/26/2026` in `en-US` by
 *   default. `openOnClick` opens the panel on a press on the input. The input is named by the
 *   label, followed by its own `aria-label` where the caller passes one, such as "Check-in" in a
 *   range, else by its `aria-label` alone, and is described by a field's texts. It submits nothing:
 *   the root's hidden inputs submit the dates in ISO 8601.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { groupLabelledBy } from "#date-input/names.ts";
import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useShared } from "#date-picker/state.ts";

/**
 * Renders the `input` with the date picker's input class.
 */
const Typed = withContext("input", "input");

/**
 * Describes the props of an input: the index of its date, whether the machine fixes its text on
 * blur, and the props of an `input`.
 */
export interface InputProps extends ComponentProps<typeof Typed> {
  /**
   * Whether the machine writes the last date back over text it cannot parse when the input loses
   * focus. Defaults to true.
   */
  readonly fixOnBlur?: boolean | undefined;

  /**
   * Index of the date the input edits: 0 for a single date and the start of a range, 1 for the
   * end. Defaults to 0.
   */
  readonly index?: number | undefined;
}

/**
 * Renders the input with the machine's input props, named after the label and its own
 * `aria-label`.
 *
 * @param props - The index, `fixOnBlur` and the props of an `input`.
 * @returns The `input` element.
 */
export function Input({ fixOnBlur, index = 0, ...props }: InputProps): ReactElement {
  const api = useDatePicker();
  const { describedBy, ids, label, required } = useShared();
  const {
    name: _name,
    required: _required,
    ...machine
  }: InputProps = { ...api.getInputProps(omitUndefined({ fixOnBlur, index })) };
  const own = omitUndefined({
    "aria-describedby": describedBy,
    "aria-labelledby": groupLabelledBy(label, props["aria-label"], ids.input(index)),
    "aria-required": required ? true : undefined,
  });

  return <Typed {...mergeProps(machine, own, props)} />;
}
