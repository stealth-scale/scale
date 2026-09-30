/**
 * Runs the editable machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the preview, the
 *   input and the triggers report one value and one mode. Enter saves the value, Escape restores
 *   the value from before editing, and a press outside saves it unless `submitMode` says otherwise.
 */

import { useId } from "react";

import * as editable from "@zag-js/editable";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `editable.connect` returns: a prop getter per part, and the value, the mode
 * and the methods that change them.
 */
export type EditableApi = ReturnType<typeof editable.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The triggers take their
 *   names as `label`.
 */
export type EditableOptions = Omit<Partial<editable.Props>, "translations">;

/**
 * Describes what `onValueChange`, `onValueCommit` and `onValueRevert` receive: the value.
 */
export type ValueChangeDetails = editable.ValueChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useEditable` throws for a part rendered outside `Editable.Root`.
 */
export const [ApiProvider, useEditable] = createRequiredContext<EditableApi>("Editable");

/**
 * Describes what the root needs from the machine: the api and the IDs the parts name each other
 * by.
 */
export interface EditableMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: EditableApi;

  /**
   * ID the machine gives `Editable.Label`.
   */
  readonly labelId: string;

  /**
   * ID the machine gives `Editable.Preview`.
   */
  readonly previewId: string;
}

/**
 * Describes the IDs of the parts focus can return to.
 */
interface Returns {
  /**
   * ID of the edit trigger.
   */
  readonly editTrigger: string;

  /**
   * ID of the preview.
   */
  readonly preview: string;
}

/**
 * Returns the element with an ID, found by attribute because a React ID contains colons.
 */
function byId(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[id="${id}"]`);
}

/**
 * Returns the function that finds the element focus moves to after Enter or Escape: the edit
 * trigger, or else the preview.
 *
 * @remarks
 *   With `activationMode` `focus` the preview reopens the field as it takes focus, so focus moves
 *   to the edit trigger alone.
 */
function returned(
  ids: Returns,
  activation: EditableOptions["activationMode"],
): () => HTMLElement | null {
  /**
   * Finds the edit trigger, or else the preview when focusing it does not reopen the field.
   */
  function target(): HTMLElement | null {
    return byId(ids.editTrigger) ?? (activation === "focus" ? null : byId(ids.preview));
  }

  return target;
}

/**
 * Starts the editable machine and returns its connected api and the label's ID.
 *
 * @remarks
 *   `activationMode` defaults to `click`, so a person opens the field with a press, Enter or Space
 *   on the preview, and Tab moves past it. After Enter or Escape focus moves to the edit trigger or
 *   the preview, so it stays on the part a person used. Inside a field the input takes the field's
 *   control ID. An ID or an option the caller passes replaces each.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the editable gives its control, or nothing outside a field.
 * @returns The connected api, and the IDs of the label and the preview.
 */
export function useEditableMachine(
  options: EditableOptions,
  control: string | undefined,
): EditableMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const activation = options.activationMode ?? "click";
  const ids = {
    editTrigger: options.ids?.editTrigger ?? `editable:${id}:edit`,
    label: options.ids?.label ?? `editable:${id}:label`,
    preview: options.ids?.preview ?? `editable:${id}:preview`,
  };
  const service = useMachine(editable.machine, {
    finalFocusEl: returned(ids, activation),
    ...omitUndefined(options),
    activationMode: activation,
    id,
    ids: { ...omitUndefined({ input: control }), ...options.ids, ...ids },
  });

  return {
    api: editable.connect(service, normalizeProps),
    labelId: ids.label,
    previewId: ids.preview,
  };
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
export function splitEditableProps<Props extends EditableOptions>(
  props: Props,
): [EditableOptions, Omit<Props, keyof editable.Props>] {
  const [options, rest] = splitEnumerable(editable.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
