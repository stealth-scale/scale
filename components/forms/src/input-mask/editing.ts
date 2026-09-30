/**
 * Turns one edit of a masked input into the value to show and the caret position.
 *
 * @remarks
 *   The browser applies an edit to the input, and the input reports the text and the caret after
 *   it. The engine masks that text. The caret keeps its place among the typed characters: after a
 *   character typed at the end it moves to the end, after one typed in the middle it lands after
 *   that character, and after a deletion it keeps the position the deletion left. A value that
 *   keeps none of the tokens' characters is empty, so deleting the last digit of `(5` empties it. A
 *   refused character leaves the value and puts the caret back where it was. Backspace or Delete on
 *   a character of the pattern deletes the nearest typed character beyond it as well, because the
 *   engine writes the pattern's character back. Where no typed character lies beyond it, the value
 *   and the caret do not change.
 */

import { type Mask } from "maska";

/**
 * Describes one edit: the value before it, and the text and caret the input reports after it.
 */
export interface Edit {
  /**
   * Caret position after the edit.
   */
  readonly caret: number;

  /**
   * `inputType` of the input event, or nothing where the event states none.
   */
  readonly inputType?: string | undefined;

  /**
   * Value the input showed before the edit.
   */
  readonly previous: string;

  /**
   * Text in the input after the browser applied the edit.
   */
  readonly typed: string;
}

/**
 * Describes the outcome of an edit: the value to show and the caret position.
 */
export interface Edited {
  /**
   * Caret position in the value.
   */
  readonly caret: number;

  /**
   * Value to show.
   */
  readonly value: string;
}

/**
 * Returns whether an input type deletes text.
 */
function deletes(inputType: string | undefined): boolean {
  return inputType?.startsWith("delete") === true;
}

/**
 * Returns the masked text, or nothing where the text keeps none of the tokens' characters.
 */
function settled(mask: Mask, text: string): string {
  const value = mask.masked(text);

  return mask.unmasked(value) === "" ? "" : value;
}

/**
 * Returns the first position in a value after which the given count of token characters lies.
 */
function after(mask: Mask, value: string, count: number): number {
  let end = 0;

  while (end < value.length && mask.unmasked(value.slice(0, end)).length < count) end += 1;

  return end;
}

/**
 * Returns the caret position in the masked value for the caret the edit left in the typed text.
 */
function caretOf(mask: Mask, edit: Edit, value: string): number {
  const { caret, inputType, typed } = edit;
  const deleting = deletes(inputType);

  if (!deleting && caret >= typed.length) return value.length;
  if (typed.slice(0, caret) === value.slice(0, caret)) return caret;
  if (deleting) return Math.min(Math.max(caret + value.length - typed.length, 0), value.length);

  return after(mask, value, mask.unmasked(typed.slice(0, caret)).length);
}

/**
 * Returns the edit widened past the pattern's characters it removed, one character at a time
 * towards its direction, until the engine no longer writes them back.
 */
function widened(mask: Mask, edit: Edit, forward: boolean): Edited | undefined {
  const { caret, previous, typed } = edit;
  const removed = previous.length - typed.length;

  for (
    let extra = 1;
    forward ? caret + removed + extra <= previous.length : caret - extra >= 0;
    extra += 1
  ) {
    const start = forward ? caret : caret - extra;
    const text = previous.slice(0, start) + previous.slice(caret + removed + (forward ? extra : 0));
    const value = settled(mask, text);

    if (value !== previous) {
      return { caret: caretOf(mask, { ...edit, caret: start, typed: text }, value), value };
    }
  }

  return undefined;
}

/**
 * Returns the outcome of a Backspace or a Delete that removed the pattern's characters alone, or
 * nothing for any other edit.
 */
function rewritten(mask: Mask, edit: Edit, value: string): Edited | undefined {
  const { caret, inputType, previous, typed } = edit;
  const forward = inputType === "deleteContentForward";

  if (value !== previous || typed === previous) return undefined;
  if (!forward && inputType !== "deleteContentBackward") return undefined;

  return (
    widened(mask, edit, forward) ?? {
      caret: forward ? caret : caret + previous.length - typed.length,
      value,
    }
  );
}

/**
 * Returns the value to show and the caret position after one edit of a masked input.
 *
 * @param mask - The engine that masks the text.
 * @param edit - The value before the edit, and the text, caret and input type after it.
 * @returns The masked value and the caret position in it.
 */
export function edited(mask: Mask, edit: Edit): Edited {
  const { caret, inputType, previous, typed } = edit;
  const value = settled(mask, typed);
  const kept = rewritten(mask, edit, value);

  if (kept !== undefined) return kept;

  if (value === previous && !deletes(inputType)) {
    return { caret: Math.max(caret - (typed.length - previous.length), 0), value };
  }

  return { caret: caretOf(mask, edit, value), value };
}
