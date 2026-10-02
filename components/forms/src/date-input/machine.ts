/**
 * Runs the date input machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the segments, the
 *   hidden inputs and the clear trigger report one value. The machine derives every element's
 *   identifier from `id`.
 */

import { useId } from "react";

import * as dateInput from "@zag-js/date-input";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

import { zoneOf } from "#zone.ts";

/**
 * Defines the machine without the effect that starts its assertive live region.
 *
 * @remarks
 *   A screen reader reads the focused segment's value text as it changes. The machine's region
 *   repeats each change in English, and React Aria's date field announces nothing beyond the
 *   segment.
 */
const MACHINE = { ...dateInput.machine, effects: [] };

/**
 * Describes the api `dateInput.connect` returns: a prop getter per part, and the machine's value,
 * its segments and the methods that change them.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine.
 */
export type DateInputApi = ReturnType<typeof dateInput.connect>;

/**
 * Describes the machine options, every one optional.
 *
 * @remarks
 *   `translations` is left out, because the segments take their names and placeholders from the
 *   locale. `formatter`, `allSegments` and `format` are left out, because the root submits ISO 8601
 *   and the machine derives the segments from the locale and `granularity`.
 */
export type DateInputOptions = Omit<
  Partial<dateInput.Props>,
  "allSegments" | "format" | "formatter" | "translations"
>;

/**
 * Describes what `onValueChange` receives: the dates and their text.
 */
export type ValueChangeDetails = dateInput.ValueChangeDetails;

/**
 * Describes what `onPlaceholderChange` receives: the placeholder date the segments read.
 */
export type PlaceholderChangeDetails = dateInput.PlaceholderChangeDetails;

/**
 * Describes what `onFocusChange` receives: whether a segment has focus.
 */
export type FocusChangeDetails = dateInput.FocusChangeDetails;

/**
 * Describes one segment of a date, as `DateInput.Segment` receives it.
 */
export type DateSegment = dateInput.DateSegment;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useDateInput` throws for a part rendered outside `DateInput.Root`.
 */
export const [ApiProvider, useDateInput] = createRequiredContext<DateInputApi>("DateInput");

/**
 * Describes the IDs the parts name and find each other by, per group of segments.
 */
export interface Ids {
  /**
   * Returns the ID of the hidden input of a group.
   */
  readonly hiddenInput: (index: number) => string;

  /**
   * Returns the ID of the label of a group.
   */
  readonly label: (index: number) => string;

  /**
   * Returns the ID of a group of segments.
   */
  readonly segmentGroup: (index: number) => string;
}

/**
 * Describes what the root needs from the machine: the api, the IDs and the function a form reset
 * calls.
 */
export interface DateInputMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: DateInputApi;

  /**
   * IDs the parts name and find each other by.
   */
  readonly ids: Ids;

  /**
   * Restores the dates the machine started with, as a form reset does.
   */
  readonly reset: () => void;
}

/**
 * Returns the IDs of the parts: the caller's where it states one, else one built from the
 * machine's ID.
 *
 * @remarks
 *   Inside a field the first group's hidden input takes the field's control ID, so the field's
 *   label points at it and the input moves focus on to the first segment.
 * @param id - The machine's ID.
 * @param stated - The IDs the caller passes, or nothing.
 * @param control - ID the field around the input gives its control, or nothing outside a field.
 * @returns The ID builders of the hidden inputs, the labels and the groups.
 */
export function idsOf(id: string, stated?: dateInput.ElementIds, control?: string): Ids {
  return {
    hiddenInput: (index) =>
      stated?.hiddenInput?.(index) ??
      (index === 0 && control !== undefined ? control : `date-input:${id}:hidden-input:${index}`),
    label: (index) => stated?.label?.(index) ?? `date-input:${id}:label:${index}`,
    segmentGroup: (index) =>
      stated?.segmentGroup?.(index) ?? `date-input:${id}:segment-group:${index}`,
  };
}

/**
 * Starts the date input machine and returns its connected api, the IDs of the parts and the
 * function that restores the first dates.
 *
 * @remarks
 *   An ID or an option the caller passes replaces each. `shouldForceLeadingZeros` defaults to true,
 *   so a one-digit day fills its 24px cell as `02`, the width of its placeholder `dd`.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the input gives its control, or nothing outside a field.
 * @returns The connected api, the IDs and the reset.
 */
export function useDateInputMachine(
  options: DateInputOptions,
  control: string | undefined,
): DateInputMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const ids = idsOf(id, options.ids, control);
  const service = useMachine(MACHINE, {
    ...omitUndefined({
      ...options,
      shouldForceLeadingZeros: options.shouldForceLeadingZeros ?? true,
      timeZone: zoneOf(options),
    }),
    id,
    ids: { ...options.ids, ...ids },
  });

  /**
   * Restores the dates the machine started with.
   */
  function reset(): void {
    service.send({ type: "VALUE.SET", value: service.context.initial("value") });
  }

  return { api: dateInput.connect(service, normalizeProps), ids, reset };
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations`, `formatter`, `allSegments` and `format`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitDateInputProps<Props extends DateInputOptions>(
  props: Props,
): [DateInputOptions, Omit<Props, keyof dateInput.Props>] {
  const [options, rest] = splitEnumerable(dateInput.splitProps<Props>)(props);
  const {
    allSegments: _segments,
    format: _format,
    formatter: _formatter,
    translations: _translations,
    ...kept
  } = options;

  return [kept, rest];
}
