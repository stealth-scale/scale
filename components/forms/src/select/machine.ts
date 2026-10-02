/**
 * Runs the select machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the trigger, the
 *   value text and the rows report one value and one highlight. The machine derives every element's
 *   identifier and ARIA reference from `id`. The panel opens under the trigger and as wide as it
 *   unless the caller's `positioning` sets another placement or width. The machine scrolls a row
 *   the keys highlight into view in the listbox, the element that scrolls.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as select from "@zag-js/select";

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
export type SelectItem = unknown;

/**
 * Describes the api `select.connect` returns: a prop getter per part, and the machine's value, its
 * highlight and the methods that change them.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine. It references
 *   `@zag-js/types` and `@zag-js/collection`, so the package declares both dependencies.
 */
export type SelectApi = ReturnType<typeof select.connect>;

/**
 * Describes the machine options, every one optional. The root requires `collection`.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The clear trigger takes its
 *   name as `label`.
 */
export type SelectOptions = Omit<Partial<select.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the selected values and their items.
 */
export type ValueChangeDetails = select.ValueChangeDetails;

/**
 * Describes what `onOpenChange` receives: whether the panel opens, and the value.
 */
export type OpenChangeDetails = select.OpenChangeDetails;

/**
 * Describes what `onHighlightChange` receives: the highlighted value, its item and its index.
 */
export type HighlightChangeDetails = select.HighlightChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useSelect` throws for a part rendered outside `Select.Root`.
 */
export const [ApiProvider, useSelect] = createRequiredContext<SelectApi>("Select");

/**
 * Provides the panel's presence to the positioner and the content, and reads it back.
 */
export const [PresenceProvider, usePanelPresence] = createRequiredContext<Presence>("Select");

/**
 * Describes what the root needs from the machine: the api and the IDs the parts name each other
 * by.
 */
export interface SelectMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: SelectApi;

  /**
   * Closes the panel and leaves focus where it is.
   */
  readonly dismiss: () => void;

  /**
   * ID the machine gives `Select.Label`.
   */
  readonly labelId: string;

  /**
   * ID the machine gives `Select.Trigger`.
   */
  readonly triggerId: string;
}

/**
 * Returns the function that builds a row's ID from its value, encoded so that a value with a space
 * or a quote still makes one valid ID.
 *
 * @param id - Base of the select's IDs.
 */
export function optionIds(id: string): (value: number | string) => string {
  return (value) => `select:${id}:option:${encodeURIComponent(String(value))}`;
}

/**
 * Starts the select machine and returns its connected api and the IDs of the label and the
 * trigger.
 *
 * @remarks
 *   Inside a field the hidden select takes the field's control ID, so the field's label points at
 *   it, and a press on the label moves focus to the trigger. A row's ID encodes its value, because
 *   `aria-activedescendant` takes one ID and a space would split it. The panel is as wide as the
 *   trigger unless `positioning.sameWidth` is false. An ID or an option the caller passes replaces
 *   each.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the select gives its control, or nothing outside a field.
 * @returns The connected api, the function that closes the panel in place, and the IDs of the
 *   label and the trigger.
 */
export function useSelectMachine(
  options: SelectOptions,
  control: string | undefined,
): SelectMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `select:${id}:label`;
  const triggerId = options.ids?.trigger ?? `select:${id}:trigger`;
  const service = useMachine(select.machine, {
    ...omitUndefined(options),
    id,
    ids: {
      item: optionIds(id),
      ...omitUndefined({ hiddenSelect: control }),
      ...options.ids,
      label: labelId,
      trigger: triggerId,
    },
    positioning: { sameWidth: true, ...options.positioning },
  });

  /**
   * Closes the panel without returning focus to the trigger.
   *
   * @remarks
   *   The machine keeps the panel open while focus is on the clear trigger, which it excludes from
   *   the presses and the focus that close the panel.
   */
  function dismiss(): void {
    service.send({ restoreFocus: false, type: "CLOSE" });
  }

  return { api: select.connect(service, normalizeProps), dismiss, labelId, triggerId };
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
export function splitSelectProps<Props extends SelectOptions>(
  props: Props,
): [SelectOptions, Omit<Props, keyof select.Props>] {
  const [options, rest] = splitEnumerable(select.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
