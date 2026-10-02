/**
 * Builds the input masks the part specifications render, and edits an input the way a browser
 * does.
 */

import { type ReactElement } from "react";

import { act, fireEvent } from "@testing-library/react";

import { Input, type InputProps } from "#input-mask/input.tsx";
import { Root, type RootProps } from "#input-mask/root.tsx";

/**
 * Props of the input when the case sets none: the name `Phone`.
 */
const NAMED: InputProps = { "aria-label": "Phone" };

/**
 * Renders a phone number masked as `(999) 999-9999`, with the props the case sets on the root and
 * on the input.
 *
 * @param props - The props of the root.
 * @param input - The props of the input. Defaults to the name `Phone`.
 * @returns The input mask.
 */
export function composed(props: RootProps = {}, input: InputProps = NAMED): ReactElement {
  return (
    <Root mask="(999) 999-9999" {...props}>
      <Input {...input} />
    </Root>
  );
}

/**
 * Focuses an input, writes the text an edit leaves, puts the caret, and fires the input event.
 *
 * @remarks
 *   The text goes through the input element's own value setter, which React's value tracker does
 *   not see, so React reports the change as it does for a browser's edit.
 * @param input - The input to edit.
 * @param typed - The text in the input after the edit.
 * @param caret - The caret position after the edit.
 * @param inputType - The input event's `inputType`. Defaults to `insertText`.
 */
export function edit(
  input: HTMLInputElement,
  typed: string,
  caret: number,
  inputType = "insertText",
): void {
  act(() => {
    input.focus();
  });
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, typed);
  input.setSelectionRange(caret, caret);
  fireEvent(input, new InputEvent("input", { bubbles: true, inputType }));
}

/**
 * Types text at a position of an input's value.
 *
 * @param input - The input to type into.
 * @param at - The caret position the text is typed at.
 * @param text - The text to type.
 */
export function inserted(input: HTMLInputElement, at: number, text: string): void {
  edit(input, input.value.slice(0, at) + text + input.value.slice(at), at + text.length);
}

/**
 * Presses Backspace with the caret at a position of an input's value.
 *
 * @param input - The input to press Backspace in.
 * @param at - The caret position before the key.
 */
export function backspaced(input: HTMLInputElement, at: number): void {
  edit(
    input,
    input.value.slice(0, at - 1) + input.value.slice(at),
    at - 1,
    "deleteContentBackward",
  );
}
