/**
 * Resolves an input mask's options into the engine that masks text, and reads what a value reports.
 *
 * @remarks
 *   The engine is maska's `Mask`. It keeps each character a token accepts, writes the pattern's
 *   other characters between them, and formats a number for a locale. The library's tokens replace
 *   maska's: `9` is a digit, `a` a letter, `A` a letter written in capitals and `*` a letter or a
 *   digit. A `!` before a character keeps it as text, so `+4!9` writes a literal 9. The engine's
 *   own input binding is not used: it writes the value through React's value tracker, so React does
 *   not report the change.
 */

import { Mask, type MaskOptions, type MaskTokens, type MaskType } from "maska";

import { omitUndefined } from "@stealthscale/hooks";

export { type MaskTokens } from "maska";

/**
 * Describes a pattern: one pattern, an array of patterns the engine chooses from by the length of
 * the value, or a function of the value that returns one.
 */
export type Pattern = NonNullable<MaskType>;

/**
 * Describes a number mask: the locale, the most digits after the decimal separator, and whether a
 * sign is refused.
 */
export type NumberFormat = NonNullable<MaskOptions["number"]>;

/**
 * Describes the `inputMode` a mask sets on the input.
 */
export type Keyboard = "decimal" | "numeric";

/**
 * Describes the mask options the root takes.
 */
export interface MaskingOptions {
  /**
   * Whether the pattern's characters after a typed one are written at once, such as the `/` after
   * a month. By default they are written when the next token is typed.
   */
  readonly eager?: boolean | undefined;

  /**
   * Pattern of the value, an array from which the engine takes the shortest pattern that fits
   * every typed character, or a function that returns the pattern for the value.
   */
  readonly mask?: Pattern | undefined;

  /**
   * Formats the value as a number in a locale, with the locale's grouping and decimal separators.
   * A number mask replaces `mask`.
   */
  readonly number?: NumberFormat | undefined;

  /**
   * Tokens added to the library's four, or replacing one of them by its character.
   */
  readonly tokens?: MaskTokens | undefined;
}

/**
 * Describes what `onValueChange` and `onValueComplete` receive.
 */
export interface ValueChangeDetails {
  /**
   * Whether the value fills the pattern. A number mask has no length to fill and is never
   * complete.
   */
  readonly complete: boolean;

  /**
   * Characters the tokens accepted, without the pattern's own characters. A number mask returns
   * the number with a `.` decimal separator, such as `1234.5`.
   */
  readonly unmasked: string;

  /**
   * Value as the input shows it.
   */
  readonly value: string;
}

/**
 * Describes a resolved mask: the engine, the completeness check and the keyboard.
 */
export interface Masker {
  /**
   * Returns whether a value fills the pattern that renders it.
   */
  readonly complete: (value: string) => boolean;

  /**
   * Engine that masks and unmasks text.
   */
  readonly engine: Mask;

  /**
   * `inputMode` the mask sets, or nothing where the pattern accepts letters.
   */
  readonly keyboard: Keyboard | undefined;
}

/**
 * Tokens every pattern reads, unless the caller replaces one.
 */
export const TOKENS: MaskTokens = {
  "*": { pattern: /[\dA-Za-z]/u },
  "9": { pattern: /\d/u },
  A: { pattern: /[A-Za-z]/u, transform: (character) => character.toUpperCase() },
  a: { pattern: /[A-Za-z]/u },
};

/**
 * Character that keeps the character after it as text.
 */
const ESCAPE = "!";

/**
 * Returns the characters of a pattern that the tokens read, without the escaped ones.
 */
function tokensIn(pattern: string, tokens: MaskTokens): string[] {
  const read: string[] = [];

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern.charAt(index);

    if (character === ESCAPE) index += 1;
    else if (Object.hasOwn(tokens, character)) read.push(character);
  }

  return read;
}

/**
 * Returns how many characters a value needs to fill a pattern: every character but an escape and
 * an optional token.
 */
function lengthOf(pattern: string, tokens: MaskTokens): number {
  let length = 0;

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern.charAt(index);

    if (character === ESCAPE) index += 1;
    if (character === ESCAPE || tokens[character]?.optional !== true) length += 1;
  }

  return length;
}

/**
 * Returns the patterns a value may be rendered by: the one pattern, each of an array, or the one a
 * function returns for the value.
 */
function patternsOf(mask: Pattern, value: string): readonly string[] {
  if (typeof mask === "function") return [mask(value)];

  return typeof mask === "string" ? [mask] : mask;
}

/**
 * Returns the keyboard for a mask: decimal for a number with a fraction, numeric for a whole
 * number or a pattern of digit tokens alone, and nothing otherwise.
 */
function keyboardOf(options: MaskingOptions, tokens: MaskTokens): Keyboard | undefined {
  if (options.number !== undefined)
    return (options.number.fraction ?? 0) > 0 ? "decimal" : "numeric";

  const { mask } = options;

  if (mask === undefined || typeof mask === "function") return undefined;

  const read = patternsOf(mask, "").flatMap((pattern) => tokensIn(pattern, tokens));
  const digits = read.length > 0 && read.every((character) => character === "9");

  return digits && options.tokens?.["9"] === undefined ? "numeric" : undefined;
}

/**
 * Resolves the mask options into the engine, the completeness check and the keyboard.
 *
 * @param options - The mask options the root takes.
 * @returns The resolved mask.
 */
export function maskerOf(options: MaskingOptions): Masker {
  const tokens = { ...TOKENS, ...options.tokens };
  const shared = { ...omitUndefined({ eager: options.eager }), tokens, tokensReplace: true };
  const engine = new Mask({
    ...shared,
    ...omitUndefined({ mask: options.mask, number: options.number }),
  });

  return {
    complete: (value) => {
      const { mask } = options;

      if (options.number !== undefined || mask === undefined || value === "") return false;

      return patternsOf(mask, value).some(
        (pattern) =>
          new Mask({ ...shared, mask: pattern }).masked(value) === value &&
          value.length >= lengthOf(pattern, tokens),
      );
    },
    engine,
    keyboard: keyboardOf(options, tokens),
  };
}

/**
 * Returns what a value reports: itself, the characters the tokens accepted, and whether it fills
 * the pattern.
 *
 * @param masker - The resolved mask.
 * @param value - The value as the input shows it.
 * @returns The details `onValueChange` receives.
 */
export function detailsOf(masker: Masker, value: string): ValueChangeDetails {
  return { complete: masker.complete(value), unmasked: masker.engine.unmasked(value), value };
}
