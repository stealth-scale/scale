/**
 * Renders the input through which a form submits one date of the date input.
 *
 * @remarks
 *   The input is visually hidden, `aria-hidden` and out of the tab order, and its value is the date
 *   in ISO 8601, such as `2026-09-26`, under `name`, or `name[0]` and `name[1]` for a range. It is
 *   a text input, so `required` refuses an empty date, where the machine's `type="hidden"` input
 *   skips validation. It is empty while a segment of its date is empty, because the machine keeps
 *   the last whole date until every segment is cleared. Focus that reaches it, such as a press on a
 *   field's label or a browser's
 *   focus on an invalid control, moves to the first segment of its group. A reset of its form
 *   restores the dates the input started with.
 */

import { type FocusEvent, type ReactElement, useEffect, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { useCallbackRef } from "@stealthscale/hooks";

import { useDateInput } from "#date-input/machine.ts";
import { submittedName } from "#date-input/names.ts";
import { useShared } from "#date-input/state.ts";

/**
 * Describes the props of the hidden input: the index of its group, the root's name and the
 * selection mode.
 */
export interface HiddenInputProps {
  /**
   * Index of the group whose date the input submits.
   */
  readonly index: number;

  /**
   * The root's `name`, or nothing for an input that submits nothing.
   */
  readonly name?: string | undefined;

  /**
   * Whether the input edits a range, which indexes the name.
   */
  readonly range: boolean;
}

/**
 * Keeps the input's value where the root sets it. The input changes only with the machine's value.
 */
function kept(): void {}

/**
 * Renders the hidden input of one group, and restores the first dates when its form resets.
 *
 * @param props - The index of the group, the name and the selection mode.
 * @returns The `input` element.
 */
export function HiddenInput({ index, name, range }: HiddenInputProps): ReactElement {
  const api = useDateInput();
  const { ids, reset } = useShared();
  const restored = useCallbackRef(reset);
  const [node, setNode] = useState<HTMLInputElement | null>(null);
  const form = node?.form;
  const complete = api
    .getSegments({ index })
    .every((segment) => !segment.isEditable || !segment.isPlaceholder);
  const {
    name: _name,
    type: _type,
    value: _value,
    ...machine
  }: Record<string, unknown> = { ...api.getHiddenInputProps({ index }) };
  const own = {
    "aria-hidden": true,
    name: submittedName(name, range, index),
    onChange: kept,
    onFocus: (event: FocusEvent<HTMLInputElement>): void => {
      event.currentTarget.ownerDocument
        .querySelector<HTMLElement>(`[id="${ids.segmentGroup(index)}"] [tabindex]`)
        ?.focus();
    },
    tabIndex: -1,
    value: complete ? (api.value[index]?.toString() ?? "") : "",
  };

  useEffect(() => {
    form?.addEventListener("reset", restored);

    return (): void => {
      form?.removeEventListener("reset", restored);
    };
  }, [form, restored]);

  return <input {...mergeProps(machine, own)} ref={setNode} />;
}
