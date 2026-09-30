/**
 * Runs the tags input machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the input, the tags
 *   and the triggers report one value. Enter or the delimiter adds the typed text as a tag, and
 *   Backspace or the arrow keys at the start of the input move a highlight onto the tags, which
 *   Backspace and Delete then remove.
 */

import { useId, useRef, useState } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as tags from "@zag-js/tags-input";

import {
  createRequiredContext,
  omitUndefined,
  splitEnumerable,
  useAnnounce,
} from "@stealthscale/hooks";

import { changeMessage, highlightMessage, type Messages } from "#tags-input/announced.ts";

/**
 * Describes the api `tags.connect` returns: a prop getter per part, and the value and the methods
 * that change it.
 */
export type TagsInputApi = ReturnType<typeof tags.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The triggers take their
 *   names as `label`, and the root takes its announcements as `addedMessage`, `removedMessage`,
 *   `changedMessage` and `highlightedMessage`.
 */
export type TagsInputOptions = Omit<Partial<tags.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the tags.
 */
export type ValueChangeDetails = tags.ValueChangeDetails;

/**
 * Describes what `onInputValueChange` receives: the text typed so far.
 */
export type InputValueChangeDetails = tags.InputValueChangeDetails;

/**
 * Describes what `onHighlightChange` receives: the ID of the highlighted tag, or null.
 */
export type HighlightChangeDetails = tags.HighlightChangeDetails;

/**
 * Describes what `onValueInvalid` receives: why a tag was refused.
 */
export type ValidityChangeDetails = tags.ValidityChangeDetails;

/**
 * Describes what `validate` receives: the text to add and the tags so far.
 */
export type ValidateArgs = tags.ValidateArgs;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useTagsInput` throws for a part rendered outside `TagsInput.Root`.
 */
export const [ApiProvider, useTagsInput] = createRequiredContext<TagsInputApi>("TagsInput");

/**
 * Returns an empty announcement, which the machine does not speak.
 */
function silent(): string {
  return "";
}

/**
 * Translations that return an empty string for every announcement, which the machine's own live
 * region then does not make.
 */
const SILENT: tags.IntlTranslations = {
  noTagsSelected: "",
  tagAdded: silent,
  tagDeleted: silent,
  tagSelected: silent,
  tagsPasted: silent,
  tagUpdated: silent,
};

/**
 * Describes what the root needs from the machine: the api and the ID of the label.
 */
export interface TagsInputMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: TagsInputApi;

  /**
   * ID the machine gives `TagsInput.Label`.
   */
  readonly labelId: string;
}

/**
 * Starts the tags input machine and returns its connected api and the label's ID.
 *
 * @remarks
 *   `editable` defaults to false, so a tag is removed and typed again rather than edited in place
 *   unless the caller asks for editing. Each tag's ID is built from its position, because a value
 *   may contain a space and an ID may not. Every change of value and every move of the highlight is
 *   announced, each through a live region of its own, so a removal and the highlight that follows
 *   it are both read. The machine clears the input after `validate` refuses a tag. The hook holds
 *   the input's text and keeps it through that clear, so a person corrects the refused tag instead
 *   of typing it again. Inside a field the input takes the field's control ID.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param messages - The words the root announces.
 * @param control - ID the field around the tags input gives its control, or nothing outside a
 *   field. An input ID the caller passes in `ids` replaces it.
 * @returns The connected api and the label's ID.
 */
export function useTagsInputMachine(
  options: TagsInputOptions,
  messages: Messages,
  control: string | undefined,
): TagsInputMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `tags-input:${id}:label`;
  const announceChange = useAnnounce();
  const announceHighlight = useAnnounce();
  const [kept, setKept] = useState<readonly string[]>(options.defaultValue ?? []);
  const [typed, setTyped] = useState(options.defaultInputValue ?? "");
  const refused = useRef(false);
  const before = options.value ?? kept;
  const service = useMachine(tags.machine, {
    editable: false,
    ...omitUndefined(options),
    id,
    ids: {
      item: ({ index }) => `tags-input:${id}:tag:${index}`,
      ...omitUndefined({ input: control }),
      ...options.ids,
      label: labelId,
    },
    inputValue: options.inputValue ?? typed,
    onHighlightChange: (details) => {
      announceHighlight(highlightMessage(details.highlightedValue, messages));
      options.onHighlightChange?.(details);
    },
    onInputValueChange: (details) => {
      const clearing = refused.current && details.inputValue === "";

      refused.current = false;

      if (clearing) return;

      setTyped(details.inputValue);
      options.onInputValueChange?.(details);
    },
    onValueChange: (details) => {
      setKept(details.value);
      announceChange(changeMessage(before, details.value, messages));
      options.onValueChange?.(details);
    },
    onValueInvalid: (details) => {
      refused.current = details.reason === "invalidTag";
      options.onValueInvalid?.(details);
    },
    translations: SILENT,
  });

  return { api: tags.connect(service, normalizeProps), labelId };
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
export function splitTagsInputProps<Props extends TagsInputOptions>(
  props: Props,
): [TagsInputOptions, Omit<Props, keyof tags.Props>] {
  const [options, rest] = splitEnumerable(tags.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
