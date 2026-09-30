/**
 * Decides what a key pressed in the composer's textarea does: dismiss the reply, edit the last
 * message, send, or nothing.
 *
 * @remarks
 *   A key pressed while an input method composes text belongs to the input method: Enter then
 *   commits a candidate, and sending on it would send every word a reader of Japanese or Chinese
 *   types. ArrowUp edits the last message only from an empty textarea without a modifier, so it is
 *   the ordinary caret movement everywhere else.
 */

import { type SubmitKey } from "#composer/state.ts";

/**
 * Lists what a key does in the textarea.
 */
export type KeyAction = "cancel" | "edit" | "none" | "submit";

/**
 * Describes the parts of a key press the decision reads.
 */
export interface Pressed {
  /**
   * Whether Alt was held.
   */
  readonly altKey: boolean;

  /**
   * Whether Ctrl was held.
   */
  readonly ctrlKey: boolean;

  /**
   * Whether an input method was composing text.
   */
  readonly isComposing: boolean;

  /**
   * The key's value, such as `Enter`.
   */
  readonly key: string;

  /**
   * Whether Cmd or the Windows key was held.
   */
  readonly metaKey: boolean;

  /**
   * Whether Shift was held.
   */
  readonly shiftKey: boolean;
}

/**
 * Describes what the composer offers that a key can do.
 */
export interface Offered {
  /**
   * Whether a reply is shown that Escape dismisses.
   */
  readonly cancels: boolean;

  /**
   * Whether ArrowUp edits the last message.
   */
  readonly edits: boolean;

  /**
   * Whether the textarea is empty.
   */
  readonly empty: boolean;

  /**
   * The keys that send.
   */
  readonly submitOn: SubmitKey;
}

/**
 * Returns whether a press holds any modifier.
 */
function modified(pressed: Pressed): boolean {
  return pressed.altKey || pressed.ctrlKey || pressed.metaKey || pressed.shiftKey;
}

/**
 * Returns whether a press of Enter sends under the keys `submitOn` names.
 */
function sends(pressed: Pressed, submitOn: SubmitKey): boolean {
  return submitOn === "enter" ? !pressed.shiftKey : pressed.ctrlKey || pressed.metaKey;
}

/**
 * Returns what a key pressed in the textarea does.
 *
 * @param pressed - The key and its modifiers.
 * @param offered - The reply, the edit and the send keys the composer offers.
 * @returns The action, or `none` for a key the composer leaves to the textarea.
 */
export function actionOf(pressed: Pressed, offered: Offered): KeyAction {
  if (pressed.isComposing) return "none";
  if (pressed.key === "Escape" && offered.cancels) return "cancel";
  if (pressed.key === "ArrowUp" && offered.edits && offered.empty && !modified(pressed)) {
    return "edit";
  }
  if (pressed.key === "Enter" && sends(pressed, offered.submitOn)) return "submit";

  return "none";
}
