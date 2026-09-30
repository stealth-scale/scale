/**
 * Renders the composer's root: the `form` a reader writes and sends a message in.
 *
 * @remarks
 *   The root keeps the text, controlled through `value` or held from `defaultValue`. A send, from
 *   the submit control or from the key `submitOn` names, calls `onSubmit` with the text trimmed,
 *   clears the text unless the caller controls it, and moves focus back to the textarea. Text of
 *   whitespace alone is not a message, and attached files alone are, so the root sends while the
 *   trimmed text is not empty or `attached` is true, and never while `busy` or `disabled`. With
 *   `onAttach`, files dropped on the box are attached, and the box takes the focus edge while they
 *   are dragged over it.
 */

import { type ComponentProps, type ReactElement, type SubmitEvent, useState } from "react";

import { useControllableState } from "@stealthscale/hooks";

import { withProvider } from "#composer/context.ts";
import { useDrop } from "#composer/drop.ts";
import { StateProvider, type SubmitKey } from "#composer/state.ts";

/**
 * Renders the `form` with the composer's variants.
 */
const Form = withProvider("form", "root");

/**
 * Describes the props of the root: the text, the states, the handlers and the props of a `form`,
 * without the element's `onSubmit` event, which the text handler replaces.
 */
export interface RootProps extends Omit<ComponentProps<typeof Form>, "defaultValue" | "onSubmit"> {
  /**
   * Whether files are attached, which makes a message without text one that can be sent.
   */
  readonly attached?: boolean | undefined;

  /**
   * Whether a response is running: the composer sends nothing, and the submit control stops the
   * response where `onStop` is set.
   */
  readonly busy?: boolean | undefined;

  /**
   * Text of a composer the caller does not control.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Whether the composer takes no input.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Called with the files a reader picks, drops or pastes. Without it the composer attaches
   * nothing.
   */
  readonly onAttach?: ((files: File[]) => void) | undefined;

  /**
   * Called when Escape in the textarea dismisses the message the composer replies to.
   */
  readonly onCancelContext?: (() => void) | undefined;

  /**
   * Called when ArrowUp in an empty textarea asks to edit the reader's last message.
   */
  readonly onEditLast?: (() => void) | undefined;

  /**
   * Called when the submit control interrupts a running response.
   */
  readonly onStop?: (() => void) | undefined;

  /**
   * Called with the text, trimmed, when the reader sends it.
   */
  readonly onSubmit?: ((value: string) => void) | undefined;

  /**
   * Called with the text on every change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Keys that send, `enter` unless stated.
   */
  readonly submitOn?: SubmitKey | undefined;

  /**
   * Controlled text.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the form and provides the text and the handlers to its parts.
 *
 * @param props - The text, the states, the handlers and the props of a `form`.
 * @returns The `form` element inside the state's provider.
 */
export function Root({
  attached = false,
  busy = false,
  defaultValue = "",
  disabled = false,
  onAttach,
  onCancelContext,
  onEditLast,
  onStop,
  onSubmit,
  onValueChange,
  submitOn = "enter",
  value,
  ...props
}: RootProps): ReactElement {
  const [text, setText] = useControllableState({ defaultValue, onChange: onValueChange, value });
  const [input, setInput] = useState<HTMLTextAreaElement | null>(null);
  const { dragging, ...drop } = useDrop(onAttach, disabled);
  const canSubmit = !disabled && !busy && (text.trim() !== "" || attached);

  /**
   * Sends the text, clears a text the caller does not control, and focuses the textarea.
   *
   * @param event - The form's submit event, which the root cancels.
   */
  function submitted(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!canSubmit) return;

    onSubmit?.(text.trim());

    if (value === undefined) setText("");

    input?.focus();
  }

  return (
    <StateProvider
      value={{
        busy,
        canSubmit,
        disabled,
        input,
        onAttach,
        onCancelContext,
        onEditLast,
        onStop,
        setInput,
        setText,
        submitOn,
        text,
      }}
    >
      <Form {...props} {...drop} data-dragging={dragging ? "" : undefined} onSubmit={submitted} />
    </StateProvider>
  );
}
