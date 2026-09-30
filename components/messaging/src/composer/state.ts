/**
 * Provides what the composer's root knows to its parts: the text, whether it can be sent, and the
 * handlers the parts call.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Lists the keys that send: Enter, with Shift+Enter for a new line, or Ctrl+Enter and Cmd+Enter,
 * with Enter for a new line.
 */
export type SubmitKey = "enter" | "modEnter";

/**
 * Describes the state a composer's root provides.
 */
export interface ComposerState {
  /**
   * Whether a response is running.
   */
  readonly busy: boolean;

  /**
   * Whether there is something to send and nothing stops it.
   */
  readonly canSubmit: boolean;

  /**
   * Whether the composer takes no input.
   */
  readonly disabled: boolean;

  /**
   * The textarea, once it renders.
   */
  readonly input: HTMLTextAreaElement | null;

  /**
   * Called with the files a reader picks, drops or pastes.
   */
  readonly onAttach?: ((files: File[]) => void) | undefined;

  /**
   * Called when Escape dismisses the message the composer replies to.
   */
  readonly onCancelContext?: (() => void) | undefined;

  /**
   * Called when ArrowUp in an empty composer asks to edit the last message.
   */
  readonly onEditLast?: (() => void) | undefined;

  /**
   * Called when the stop control interrupts a running response.
   */
  readonly onStop?: (() => void) | undefined;

  /**
   * Registers the textarea, which the root focuses after a send.
   */
  readonly setInput: (input: HTMLTextAreaElement | null) => void;

  /**
   * Replaces the text.
   */
  readonly setText: (text: string) => void;

  /**
   * The keys that send.
   */
  readonly submitOn: SubmitKey;

  /**
   * The text so far.
   */
  readonly text: string;
}

/**
 * Provides the state to the parts, and reads it where a part renders.
 */
export const [StateProvider, useComposerState] = createRequiredContext<ComposerState>("Composer");
