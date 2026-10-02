/**
 * Runs the combobox machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the input, the rows
 *   and the hidden select report one value, one text and one highlight. The machine derives every
 *   element's identifier and ARIA reference from `id`. The panel opens under the control and as
 *   wide as it unless the caller's `positioning` sets another placement or width. The machine
 *   scrolls a row the keys highlight into view in the listbox, the element that scrolls.
 */

import { useId } from "react";

import * as combobox from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes one item of a collection as the parts receive it.
 *
 * @remarks
 *   The machine types an item as `any`. The parts take `unknown` and pass it back unchanged, so
 *   `any` remains in the machine's types.
 */
export type ComboboxItem = unknown;

/**
 * Describes the api `combobox.connect` returns: a prop getter per part, and the machine's value,
 * its text, its highlight and the methods that change them.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine.
 */
export type ComboboxApi = ReturnType<typeof combobox.connect>;

/**
 * Describes the machine options, every one optional. The root requires `collection`.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. `composite` is left out,
 *   because the content is the `listbox` the rows belong to.
 */
export type ComboboxOptions = Omit<Partial<combobox.Props>, "composite" | "translations">;

/**
 * Describes what `onValueChange` receives: the selected values and their items.
 */
export type ValueChangeDetails = combobox.ValueChangeDetails;

/**
 * Describes what `onInputValueChange` receives: the input's text and why it changed.
 */
export type InputValueChangeDetails = combobox.InputValueChangeDetails;

/**
 * Describes what `onOpenChange` receives: whether the panel opens, why, and the value.
 */
export type OpenChangeDetails = combobox.OpenChangeDetails;

/**
 * Describes what `onHighlightChange` receives: the highlighted value and its item.
 */
export type HighlightChangeDetails = combobox.HighlightChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useCombobox` throws for a part rendered outside `Combobox.Root`.
 */
export const [ApiProvider, useCombobox] = createRequiredContext<ComboboxApi>("Combobox");

/**
 * Provides the panel's presence to the positioner and the content, and reads it back.
 */
export const [PresenceProvider, usePanelPresence] = createRequiredContext<Presence>("Combobox");

/**
 * Describes what the root needs from the machine: the api, the label's ID, and the functions that
 * keep the input's text and the value in step.
 */
export interface ComboboxMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: ComboboxApi;

  /**
   * Clears the value of a single combobox once its text is empty.
   */
  readonly emptied: (text: string) => void;

  /**
   * ID the machine gives `Combobox.Label`.
   */
  readonly labelId: string;

  /**
   * Restores the value the machine started with.
   */
  readonly reset: () => void;

  /**
   * Restores the value's text over a text that matches no pick, unless custom values are allowed.
   */
  readonly settle: () => void;
}

/**
 * Returns the function that builds a row's ID from its value, encoded so that a value with a space
 * or a quote still makes one valid ID.
 *
 * @param id - Base of the combobox's IDs.
 */
export function optionIds(id: string): (value: string) => string {
  return (value) => `combobox:${id}:option:${encodeURIComponent(value)}`;
}

/**
 * Starts the combobox machine and returns its connected api, the label's ID and the functions the
 * input calls as its text changes and as it loses focus.
 *
 * @remarks
 *   Inside a field the input takes the field's control ID, so the field's label names it. A row's
 *   ID encodes its value, because `aria-activedescendant` takes one ID and a space would split it.
 *   An ID or an option the caller passes replaces each.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the combobox gives its control, or nothing outside a field.
 * @returns The connected api, the label's ID, and the functions that keep the text and the value
 *   in step.
 */
export function useComboboxMachine(
  options: ComboboxOptions,
  control: string | undefined,
): ComboboxMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `combobox:${id}:label`;
  const service = useMachine(combobox.machine, {
    ...omitUndefined(options),
    id,
    ids: {
      item: optionIds(id),
      ...omitUndefined({ input: control }),
      ...options.ids,
      label: labelId,
    },
  });

  /**
   * Clears the value when a person empties the text of a single combobox.
   *
   * @remarks
   *   The machine keeps the value when the text is emptied, so a form would submit a value the
   *   input no longer shows.
   */
  function emptied(text: string): void {
    if (text !== "" || service.prop("multiple") === true) return;
    if (service.context.get("value").length === 0) return;

    service.send({ type: "VALUE.SET", value: [] });
  }

  /**
   * Restores the value's text, or clears the text of a multiple combobox, as the input loses
   * focus.
   *
   * @remarks
   *   The machine restores the text as focus leaves an open panel, and on Escape once the panel is
   *   closed, but not as focus leaves a closed one. A text that matches no pick would then stay
   *   beside a value it does not name.
   */
  function settle(): void {
    if (service.prop("allowCustomValue") === true || !service.computed("isCustomValue")) return;

    const behaviour = service.prop("selectionBehavior");

    if (behaviour === "preserve") return;

    service.send({
      src: "interact-outside",
      type: "INPUT_VALUE.SET",
      value: behaviour === "clear" ? "" : service.computed("valueAsString"),
    });
  }

  /**
   * Restores the value the machine started with, as a form reset does.
   */
  function reset(): void {
    service.send({ type: "VALUE.SET", value: service.context.initial("value") });
  }

  return { api: combobox.connect(service, normalizeProps), emptied, labelId, reset, settle };
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations` and `composite`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitComboboxProps<Props extends ComboboxOptions>(
  props: Props,
): [ComboboxOptions, Omit<Props, keyof combobox.Props>] {
  const [options, rest] = splitEnumerable(combobox.splitProps<Props>)(props);
  const { composite: _composite, translations: _translations, ...kept } = options;

  return [kept, rest];
}
