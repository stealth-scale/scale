/**
 * Renders the composer's text: a `textarea` that grows with its content, and the list of
 * suggestions for a mention.
 *
 * @remarks
 *   The textarea is named by `label`, "Message" unless stated, because a placeholder disappears
 *   with the first character and is no name. It grows line by line up to `maxRows`, 8 unless
 *   stated, and then scrolls. Enter sends and Shift+Enter starts a new line, or under
 *   `submitOn="modEnter"` Ctrl+Enter and Cmd+Enter send and Enter starts a new line. Escape
 *   dismisses the reply the composer shows, and ArrowUp in an empty textarea edits the last
 *   message, where the root takes those handlers. A paste that carries files attaches them in place
 *   of pasting text, where the root takes `onAttach`. With `triggers`, a trigger character opens a
 *   mention: the caller finds `suggestions` for the query `onQueryChange` reports, the list above
 *   the box names them, and a key or a press inserts one. While the list is open its keys come
 *   first. A `ref` receives the textarea, so a control outside the composer can focus it.
 */

import {
  type ClipboardEvent,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from "react";

import { useCallbackRef } from "@stealthscale/hooks";

import { withContext } from "#composer/context.ts";
import { actionOf, type Offered } from "#composer/keys.ts";
import { ROWS } from "#composer/recipe.ts";
import { type ComposerState, useComposerState } from "#composer/state.ts";
import { Suggestions } from "#composer/suggestions.tsx";
import { type MentionOptions, type Mentions, useMentions } from "#composer/use-mentions.ts";

/**
 * Renders the `textarea` with the composer's input class.
 */
const Typed = withContext("textarea", "input");

/**
 * Describes the textarea's event handlers the input chains after the caller's.
 */
type Events = Pick<
  ComponentProps<typeof Typed>,
  "onBlur" | "onChange" | "onKeyDown" | "onPaste" | "onSelect"
>;

/**
 * Describes the props of the input: its name, its row limit, the mention options, and the props of
 * a `textarea` without the value and the style, which the composer sets.
 */
export interface InputProps
  extends MentionOptions, Omit<ComponentProps<typeof Typed>, "defaultValue" | "style" | "value"> {
  /**
   * Accessible name of the textarea, "Message" unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Most lines the textarea grows to before it scrolls, 8 unless stated.
   */
  readonly maxRows?: number | undefined;

  /**
   * Accessible name of the list of suggestions, "Suggestions" unless stated.
   */
  readonly suggestionsLabel?: string | undefined;
}

/**
 * Describes the handlers a key press may call.
 */
interface Handlers {
  /**
   * Dismisses the reply the composer shows.
   */
  readonly onCancelContext?: (() => void) | undefined;

  /**
   * Edits the last message.
   */
  readonly onEditLast?: (() => void) | undefined;
}

/**
 * Describes what the textarea's handlers read.
 */
interface Wiring {
  /**
   * The root's handlers a key press may call.
   */
  readonly handlers: Handlers;

  /**
   * The textarea's mention state.
   */
  readonly mentions: Mentions;

  /**
   * The reply, the edit and the send keys the composer offers.
   */
  readonly offered: Offered;

  /**
   * The root's attach handler.
   */
  readonly onAttach?: ((files: File[]) => void) | undefined;

  /**
   * The caller's handlers, which run first.
   */
  readonly own: Events;

  /**
   * Replaces the composer's text.
   */
  readonly setText: (text: string) => void;
}

/**
 * Runs what a key does: dismisses the reply, edits the last message, or sends.
 *
 * @param event - The key press, which the composer cancels when it acts on it.
 * @param offered - The reply, the edit and the send keys the composer offers.
 * @param handlers - The handlers the root takes.
 */
function keyed(
  event: KeyboardEvent<HTMLTextAreaElement>,
  offered: Offered,
  handlers: Handlers,
): void {
  const action = actionOf(
    {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      isComposing: event.nativeEvent.isComposing,
      key: event.key,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    },
    offered,
  );

  if (action === "none") return;

  event.preventDefault();

  if (action === "cancel") handlers.onCancelContext?.();
  else if (action === "edit") handlers.onEditLast?.();
  else event.currentTarget.form?.requestSubmit();
}

/**
 * Attaches the files a paste carries, in place of pasting text.
 *
 * @param event - The paste event, which the composer cancels when it attaches.
 * @param onAttach - The root's attach handler.
 */
function pasted(
  event: ClipboardEvent<HTMLTextAreaElement>,
  onAttach: ((files: File[]) => void) | undefined,
): void {
  const files = [...event.clipboardData.files];

  if (onAttach === undefined || files.length === 0) return;

  event.preventDefault();
  onAttach(files);
}

/**
 * Returns what the composer offers a key press, read from the root's state.
 */
function offeredBy(state: ComposerState): Offered {
  return {
    cancels: state.onCancelContext !== undefined,
    edits: state.onEditLast !== undefined,
    empty: state.text === "",
    submitOn: state.submitOn,
  };
}

/**
 * Passes the textarea to the caller's ref, a callback or an object.
 *
 * @param handed - The caller's ref, if any.
 * @param element - The textarea, or `null` once it unmounts.
 */
function forwarded(
  handed: Ref<HTMLTextAreaElement> | undefined,
  element: HTMLTextAreaElement | null,
): void {
  if (typeof handed === "function") handed(element);
  else if (handed !== null && handed !== undefined) handed.current = element;
}

/**
 * Returns the textarea's handlers, each running the caller's first.
 *
 * @param wiring - The state and the handlers the textarea's handlers read.
 * @returns The five handlers.
 */
function wired(wiring: Wiring): Events {
  const { handlers, mentions, offered, onAttach, own, setText } = wiring;

  return {
    onBlur: (event) => {
      own.onBlur?.(event);
      mentions.dismiss();
    },
    onChange: (event) => {
      own.onChange?.(event);
      setText(event.target.value);
      mentions.moved(event.currentTarget);
    },
    onKeyDown: (event) => {
      own.onKeyDown?.(event);

      if (event.defaultPrevented || mentions.keyed(event)) return;

      keyed(event, offered, handlers);
    },
    onPaste: (event) => {
      own.onPaste?.(event);

      if (!event.defaultPrevented) pasted(event, onAttach);
    },
    onSelect: (event) => {
      own.onSelect?.(event);
      mentions.moved(event.currentTarget);
    },
  };
}

/**
 * Renders the textarea with the composer's text and keys, and the list of suggestions.
 *
 * @param props - The name, the row limit, the mention options and the props of a `textarea`.
 * @returns The `textarea` element and the list.
 */
export function Input({
  label = "Message",
  maxRows = 8,
  onBlur,
  onChange,
  onKeyDown,
  onMention,
  onPaste,
  onQueryChange,
  onSelect,
  ref: handed,
  suggestions,
  suggestionsLabel = "Suggestions",
  triggers,
  ...props
}: InputProps): ReactElement {
  const state = useComposerState();
  const { disabled, input, onAttach, onCancelContext, onEditLast, setInput, setText, text } = state;
  const mentions = useMentions({ onMention, onQueryChange, suggestions, triggers }, input, setText);
  const sized: Record<string, string> = { [ROWS]: String(maxRows) };

  /**
   * Registers the textarea with the root and passes it to the caller's ref.
   */
  const attach = useCallbackRef((element: HTMLTextAreaElement | null): void => {
    setInput(element);
    forwarded(handed, element);
  });
  const events = wired({
    handlers: { onCancelContext, onEditLast },
    mentions,
    offered: offeredBy(state),
    onAttach,
    own: { onBlur, onChange, onKeyDown, onPaste, onSelect },
    setText,
  });

  return (
    <>
      <Typed
        aria-activedescendant={mentions.open ? mentions.optionId(mentions.highlight) : undefined}
        aria-autocomplete={triggers === undefined ? undefined : "list"}
        aria-controls={mentions.open ? mentions.listId : undefined}
        aria-label={label}
        disabled={disabled}
        ref={attach}
        rows={1}
        {...props}
        {...events}
        style={sized}
        value={text}
      />
      <Suggestions label={suggestionsLabel} mentions={mentions} />
    </>
  );
}
