/**
 * Renders the inputs through which a form submits the date picker's dates.
 *
 * @remarks
 *   Each input is visually hidden, `aria-hidden` and out of the tab order, and its value is a date
 *   in ISO 8601, such as `2026-09-26`: one under `name` for a single date, `name[0]` and `name[1]`
 *   for a range, and one under `name` per date for multiple dates. Each is a text input, so
 *   `required` refuses an empty date. Focus on one, such as a browser's focus on an invalid
 *   control, moves to the text input of its date, else to the first one, else to the trigger. A
 *   reset of their form restores the dates the picker started with.
 */

import {
  type ComponentProps,
  type FocusEvent,
  type ReactElement,
  useEffect,
  useState,
} from "react";

import { useCallbackRef } from "@stealthscale/hooks";

import { submittedName } from "#date-input/names.ts";
import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useShared } from "#date-picker/state.ts";
import { submittedIndexes } from "#date-picker/texts.ts";

/**
 * Renders the `input` with the date picker's hidden input class.
 */
const Submitted = withContext("input", "hiddenInput");

/**
 * Describes the props of the hidden inputs: the root's name and whether a form requires a date.
 */
export interface HiddenInputsProps {
  /**
   * The root's `name`, or nothing for inputs that submit nothing.
   */
  readonly name?: string | undefined;

  /**
   * Whether a form requires a date: both dates of a range, else the first.
   */
  readonly required: boolean;
}

/**
 * Keeps an input's value where the root sets it. The inputs change only with the machine's value.
 */
function kept(): void {}

/**
 * Renders a hidden input per date, and restores the first dates when their form resets.
 *
 * @param props - The name and whether a form requires a date.
 * @returns The `input` elements.
 */
export function HiddenInputs({ name, required }: HiddenInputsProps): ReactElement {
  const api = useDatePicker();
  const { ids, readOnly, reset } = useShared();
  const restored = useCallbackRef(reset);
  const [node, setNode] = useState<HTMLInputElement | null>(null);
  const form = node?.form;
  const range = api.selectionMode === "range";

  /**
   * Returns the props of the input of one date.
   */
  const submitted = (index: number): ComponentProps<typeof Submitted> => ({
    "aria-hidden": true,
    disabled: api.disabled,
    id: ids.hiddenInput(index),
    name: submittedName(name, range, index),
    onChange: kept,
    onFocus: (event: FocusEvent<HTMLInputElement>): void => {
      const document = event.currentTarget.ownerDocument;
      const moved =
        document.querySelector<HTMLElement>(`[id="${ids.input(index)}"]`) ??
        document.querySelector<HTMLElement>(`[id="${ids.input(0)}"]`) ??
        document.querySelector<HTMLElement>(`[id="${ids.trigger}"]`);

      moved?.focus();
    },
    readOnly,
    required: required && (range || index === 0),
    tabIndex: -1,
    value: api.value[index]?.toString() ?? "",
  });

  useEffect(() => {
    form?.addEventListener("reset", restored);

    return (): void => {
      form?.removeEventListener("reset", restored);
    };
  }, [form, restored]);

  return (
    <>
      {submittedIndexes(api).map((index) => (
        <Submitted key={index} ref={index === 0 ? setNode : undefined} {...submitted(index)} />
      ))}
    </>
  );
}
