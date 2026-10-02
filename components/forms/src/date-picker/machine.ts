/**
 * Runs the date picker machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the inputs, the
 *   tables and the triggers report one value. The machine derives every element's identifier from
 *   `id`.
 */

import { useId } from "react";

import * as datePicker from "@zag-js/date-picker";
import { trackDismissableElement } from "@zag-js/dismissable";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

import { zoneOf } from "#zone.ts";

/**
 * Describes the api `datePicker.connect` returns: a prop getter per part, and the machine's
 * value, view, visible range and the methods that change them.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine.
 */
export type DatePickerApi = ReturnType<typeof datePicker.connect>;

/**
 * Describes the machine options, every one optional.
 *
 * @remarks
 *   `translations` is left out, because every part takes its words as a prop.
 */
export type DatePickerOptions = Omit<Partial<datePicker.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the dates, their text and the view.
 */
export type ValueChangeDetails = datePicker.ValueChangeDetails;

/**
 * Describes what `onOpenChange` receives: whether the panel opens, and the dates.
 */
export type OpenChangeDetails = datePicker.OpenChangeDetails;

/**
 * Describes what `onFocusChange` receives: the date keyboard focus is on, and the dates.
 */
export type FocusChangeDetails = datePicker.FocusChangeDetails;

/**
 * Describes what `onViewChange` receives: the view in force.
 */
export type ViewChangeDetails = datePicker.ViewChangeDetails;

/**
 * Describes what `onVisibleRangeChange` receives: the view and the first and last visible dates.
 */
export type VisibleRangeChangeDetails = datePicker.VisibleRangeChangeDetails;

/**
 * Describes a view of the panel: the days of a month, the months of a year or the years of a
 * decade.
 */
export type DateView = datePicker.DateView;

/**
 * Describes a range a preset trigger sets, such as `last7Days`, or the dates it sets.
 */
export type PresetValue = datePicker.PresetTriggerValue;

/**
 * Describes the machine's scope: the root node, the IDs, and the lookups by ID.
 */
type Scope = Parameters<typeof datePicker.connect>[0]["scope"];

/**
 * Suffixes the machine gives the IDs of the parts the panel's layer reads.
 */
const SUFFIXES = {
  clearTrigger: "clear",
  content: "content",
  control: "control",
  positioner: "positioner",
  trigger: "trigger",
};

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useDatePicker` throws for a part rendered outside `DatePicker.Root`.
 */
export const [ApiProvider, useDatePicker] = createRequiredContext<DatePickerApi>("DatePicker");

/**
 * Provides the panel's presence to the positioner and the content, and reads it back.
 */
export const [PresenceProvider, usePanelPresence] = createRequiredContext<Presence>("DatePicker");

/**
 * Describes the IDs the parts name and find each other by.
 */
export interface Ids {
  /**
   * ID of the panel.
   */
  readonly content: string;

  /**
   * Returns the ID of the hidden input that submits a date.
   */
  readonly hiddenInput: (index: number) => string;

  /**
   * Returns the ID of the text input of a date.
   */
  readonly input: (index: number) => string;

  /**
   * Returns the ID of the label.
   */
  readonly label: (index: number) => string;

  /**
   * Returns the ID of a table from the key the machine builds of its view and its React ID.
   */
  readonly table: (uid: string) => string;

  /**
   * ID of the trigger.
   */
  readonly trigger: string;
}

/**
 * Describes what the root needs from the machine: the api, the IDs and the function a form reset
 * calls.
 */
export interface DatePickerMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: DatePickerApi;

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
 * Returns an element the panel's layer reads, by the ID the caller states in `ids`, else by the
 * machine's own.
 *
 * @param scope - The machine's scope.
 * @param key - Which part: the panel, its positioner, the control, the trigger or the clear
 *   trigger.
 * @returns The element, or nothing while it is out of the document.
 */
export function partOf(scope: Scope, key: keyof typeof SUFFIXES): HTMLElement | null {
  const stated: unknown = scope.ids?.[key];

  return scope.getById(
    typeof stated === "string" ? stated : `datepicker:${scope.id}:${SUFFIXES[key]}`,
  );
}

/**
 * Tracks a press, a focus and Escape outside the floating panel, and closes the panel on each.
 *
 * @remarks
 *   The machine's own effect sets a flag in the deferred outside callback and reads it one render
 *   late, so it moves focus from a control a person pressed back to the trigger. This effect moves
 *   focus to the trigger itself, and only when the press is on nothing that takes focus. Escape
 *   returns focus to the trigger through the machine.
 */
const dismissed: NonNullable<
  NonNullable<typeof datePicker.machine.implementations>["effects"]
>[string] = ({ prop, scope, send }): undefined | VoidFunction => {
  if (prop("inline") === true) return undefined;

  return trackDismissableElement(() => partOf(scope, "content"), {
    defer: true,
    exclude: () => [
      ...(partOf(scope, "control")?.querySelectorAll<HTMLElement>("[data-part=input]") ?? []),
      partOf(scope, "trigger"),
      partOf(scope, "clearTrigger"),
    ],
    layerStyleTargets: [() => partOf(scope, "positioner")],
    onDismiss: () => {
      send({ type: "CLOSE" });
    },
    onEscapeKeyDown: (event) => {
      event.preventDefault();
      send({ src: "dismissable", type: "TABLE.ESCAPE" });
    },
    onInteractOutside: (event) => {
      if (event.detail.focusable || event.detail.contextmenu) return;

      partOf(scope, "trigger")?.focus({ preventScroll: true });
    },
    type: "popover",
  });
};

/**
 * Defines the machine with the effect that tracks presses outside its panel replaced.
 */
const MACHINE = {
  ...datePicker.machine,
  implementations: {
    ...datePicker.machine.implementations,
    effects: {
      ...datePicker.machine.implementations?.effects,
      trackDismissableElement: dismissed,
    },
  },
};

/**
 * Returns the IDs of the parts: the caller's where it states one, else one built from the
 * machine's ID.
 *
 * @remarks
 *   Inside a field the first text input takes the field's control ID, so the field's label names
 *   it and a press on the label focuses it. A table's ID joins its view and its React ID with a
 *   hyphen: the machine joins them with a space, and an ID with a space is invalid.
 * @param id - The machine's ID.
 * @param stated - The IDs the caller passes, or nothing.
 * @param control - ID the field around the picker gives its control, or nothing outside a field.
 * @returns The ID builders of the hidden inputs, the text inputs, the labels and the tables, and
 *   the IDs of the panel and the trigger.
 */
export function idsOf(id: string, stated?: datePicker.ElementIds, control?: string): Ids {
  return {
    content: stated?.content ?? `datepicker:${id}:content`,
    hiddenInput: (index) => `datepicker:${id}:hidden-input:${index}`,
    input: (index) =>
      stated?.input?.(index) ??
      (index === 0 && control !== undefined ? control : `datepicker:${id}:input:${index}`),
    label: (index) => stated?.label?.(index) ?? `datepicker:${id}:label:${index}`,
    table: (uid) => stated?.table?.(uid) ?? `datepicker:${id}:table:${uid.replaceAll(" ", "-")}`,
    trigger: stated?.trigger ?? `datepicker:${id}:trigger`,
  };
}

/**
 * Starts the date picker machine and returns its connected api, the IDs of the parts and the
 * function that restores the first dates.
 *
 * @remarks
 *   An ID or an option the caller passes replaces each. The panel opens under the control with its
 *   start on the control's start. The machine formats in the zone of a zoned value unless
 *   `timeZone` is stated.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the picker gives its control, or nothing outside a field.
 * @returns The connected api, the IDs and the reset.
 */
export function useDatePickerMachine(
  options: DatePickerOptions,
  control: string | undefined,
): DatePickerMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const ids = idsOf(id, options.ids, control);
  const timeZone = zoneOf({
    defaultValue: options.defaultValue,
    placeholderValue: options.focusedValue ?? options.defaultFocusedValue,
    timeZone: options.timeZone,
    value: options.value,
  });
  const service = useMachine(MACHINE, {
    ...omitUndefined({ ...options, timeZone }),
    id,
    ids: { ...options.ids, input: ids.input, label: ids.label, table: ids.table },
    positioning: { placement: "bottom-start", ...options.positioning },
  });

  /**
   * Restores the dates the machine started with.
   */
  function reset(): void {
    service.send({ type: "VALUE.SET", value: service.context.initial("value") });
  }

  return { api: datePicker.connect(service, normalizeProps), ids, reset };
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitDatePickerProps<Props extends DatePickerOptions>(
  props: Props,
): [DatePickerOptions, Omit<Props, keyof datePicker.Props>] {
  const [options, rest] = splitEnumerable(datePicker.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
