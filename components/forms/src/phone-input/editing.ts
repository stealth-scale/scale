/**
 * Turns one edit of a phone number into the text to show, its details and the caret position.
 *
 * @remarks
 *   Every edit is formatted again, and the caret is placed after as many digits as preceded it in
 *   the text the browser reported, so a digit typed or deleted in the middle keeps the caret beside
 *   it. Backspace or Delete on a formatting character, such as the `-` of `555-0123`, removes the
 *   nearest digit before or after it as well, because the formatter writes the character back: the
 *   bracket of `(212)` would otherwise never go. Where no digit lies that way, the number does not
 *   change.
 */

import { type CountryCode } from "libphonenumber-js";

import { charactersOf, formatOf, type Formatted } from "#phone-input/number.ts";

/**
 * Describes one edit: the text before it, the text and the caret the input reports after it, the
 * kind of edit, and the country the number is read in.
 */
export interface Edit {
  /**
   * Caret position after the edit.
   */
  readonly caret: number;

  /**
   * Country a number without a `+` prefix is read in, or nothing.
   */
  readonly country: CountryCode | undefined;

  /**
   * `inputType` of the input event, or nothing where the event states none.
   */
  readonly inputType?: string | undefined;

  /**
   * Text the input showed before the edit.
   */
  readonly previous: string;

  /**
   * Text in the input after the browser applied the edit.
   */
  readonly typed: string;
}

/**
 * Describes the outcome of an edit: the number to show and the caret position in its text.
 */
export interface Edited {
  /**
   * Caret position in the text to show.
   */
  readonly caret: number;

  /**
   * The number to show, its details and the country its prefix names.
   */
  readonly formatted: Formatted;
}

/**
 * Describes a text and a caret position in it.
 */
interface Placed {
  /**
   * Caret position in the text.
   */
  readonly caret: number;

  /**
   * The text.
   */
  readonly text: string;
}

/**
 * Returns whether a character is one a number keeps: a digit or a `+`.
 */
function kept(character: string): boolean {
  return /[\d+]/u.test(character);
}

/**
 * Returns the position in a text after its given count of the number's characters.
 */
function after(text: string, count: number): number {
  let seen = 0;
  let at = 0;

  while (seen < count && at < text.length) {
    if (kept(text.charAt(at))) seen += 1;

    at += 1;
  }

  return at;
}

/**
 * Returns a deletion that removed formatting characters alone, widened to the nearest digit before
 * the caret for Backspace and after it for Delete, or the deletion unchanged where no digit lies
 * that way.
 */
function widened(edit: Edit): Placed {
  const { caret, inputType, typed } = edit;

  if (inputType === "deleteContentForward") {
    const at = typed.slice(caret).search(/\d/u);

    if (at === -1) return { caret, text: typed };

    return { caret, text: typed.slice(0, caret + at) + typed.slice(caret + at + 1) };
  }

  const at = typed.slice(0, caret).search(/\d\D*$/u);

  if (at === -1) return { caret, text: typed };

  return { caret: at, text: typed.slice(0, at) + typed.slice(at + 1) };
}

/**
 * Returns the number an edit leaves and the caret position in its text.
 *
 * @param edit - The text before the edit, the text, the caret and the input type after it, and the
 *   country.
 * @returns The number to show and the caret position.
 */
export function edited(edit: Edit): Edited {
  const { country, inputType, previous, typed } = edit;
  const formatting =
    inputType?.startsWith("delete") === true && charactersOf(typed) === charactersOf(previous);
  const { caret, text } = formatting ? widened(edit) : { caret: edit.caret, text: typed };
  const formatted = formatOf(text, country);

  if (!formatting && caret >= text.length) return { caret: formatted.text.length, formatted };

  return { caret: after(formatted.text, charactersOf(text.slice(0, caret)).length), formatted };
}
