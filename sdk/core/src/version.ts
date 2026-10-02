/**
 * Compares contract versions with caret ranges, the way semver reads a caret.
 */

/**
 * Types a caret range: `^1`, `^1.4`, `^1.4.0`, `^0.3.0`.
 */
export type CaretRange = `^${string}`;

/**
 * Describes a plugin another plugin needs, at a range of its contract's version.
 */
export interface Requirement {
  /**
   * Lets the plugin run without the plugin it needs.
   */
  readonly optional?: true | undefined;

  /**
   * Id of the plugin needed.
   */
  readonly pluginId: string;

  /**
   * Caret range over the needed contract's version.
   */
  readonly range: CaretRange;

  /**
   * The needed contract's version where the requirement was written.
   */
  readonly version?: string | undefined;
}

/**
 * Describes the contract a requirement names: its plugin id and its version.
 */
export interface Versioned {
  /**
   * Id of the plugin the contract declares.
   */
  readonly pluginId: string;

  /**
   * The contract's version, where it states one.
   */
  readonly version?: string | undefined;
}

/**
 * Lists what a requirement states beside the contract and the range.
 */
export interface Needing {
  /**
   * Lets the plugin run without the plugin it needs.
   */
  readonly optional?: true | undefined;
}

/**
 * Describes a version as its three numbers and whether it is a prerelease.
 */
interface Parsed {
  /**
   * The major, the minor and the patch.
   */
  readonly numbers: readonly [number, number, number];

  /**
   * True where the version states a prerelease, such as `1.0.0-beta.1`.
   */
  readonly prerelease: boolean;
}

/**
 * Matches a version: three numbers, then an optional prerelease and optional build metadata.
 */
const VERSION = /^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u;

/**
 * Matches a caret range: a caret, then one, two or three numbers.
 */
const RANGE = /^\^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/u;

/**
 * Parses a version.
 *
 * @param text - The text to parse.
 * @returns The version, or undefined where the text is not one.
 */
function versionOf(text: string): Parsed | undefined {
  const match = VERSION.exec(text);

  if (match === null) return undefined;

  return {
    numbers: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] !== undefined,
  };
}

/**
 * Returns the numbers a caret range states, one to three of them.
 *
 * @param text - The text to parse.
 * @returns The numbers, or undefined where the text is not a caret range.
 */
function rangeOf(text: string): readonly number[] | undefined {
  const match = RANGE.exec(text);

  if (match === null) return undefined;

  return match.slice(1).flatMap((part) => (part === undefined ? [] : [Number(part)]));
}

/**
 * Compares a version's numbers with the lowest version a range admits.
 *
 * @param numbers - The version's major, minor and patch.
 * @param stated - The numbers the range states, the missing ones read as zero.
 * @returns A negative number where the version is lower, zero where equal, else a positive one.
 */
function compared(numbers: readonly number[], stated: readonly number[]): number {
  for (const [at, number] of numbers.entries()) {
    const difference = number - (stated[at] ?? 0);

    if (difference !== 0) return difference;
  }

  return 0;
}

/**
 * Parses a range and a version, and throws where either is malformed.
 *
 * @param caller - Name of the function that parses, for the message.
 * @param range - The text to read as a caret range.
 * @param version - The text to read as a version.
 * @returns The range's numbers and the version.
 * @throws {@link TypeError} When the range is not a caret range or the version is not a version.
 */
function operands(
  caller: string,
  range: string,
  version: string,
): readonly [readonly number[], Parsed] {
  const stated = rangeOf(range);
  const given = versionOf(version);

  if (stated === undefined || given === undefined) {
    throw new TypeError(
      `${caller}() takes a caret range and a version, and received ${JSON.stringify(range)} and ` +
        `${JSON.stringify(version)}.`,
    );
  }

  return [stated, given];
}

/**
 * Returns true for a version: three numbers, then an optional prerelease and build metadata.
 *
 * @param text - The text to check.
 */
export function isVersion(text: string): boolean {
  return versionOf(text) !== undefined;
}

/**
 * Returns true for a caret range over one, two or three numbers.
 *
 * @param text - The text to check.
 */
export function isCaretRange(text: string): text is CaretRange {
  return rangeOf(text) !== undefined;
}

/**
 * Returns true when a version satisfies a caret range, the way semver reads a caret.
 *
 * @remarks
 *   The range fixes its first non-zero number, or every number it states where all are zero:
 *   `^1.4.0` admits `1.9.2`, `^0.4.0` admits `0.4.7`, `^0.0.3` admits `0.0.3` alone and `^0`
 *   admits every `0.x.y`. A prerelease satisfies no range, as semver reads a range without a
 *   prerelease of its own.
 * @param range - The caret range.
 * @param version - The version to check.
 * @throws {@link TypeError} When the range is not a caret range or the version is not a version.
 */
export function compatible(range: string, version: string): boolean {
  const [stated, given] = operands("compatible", range, version);

  if (given.prerelease || compared(given.numbers, stated) < 0) return false;

  const nonZero = stated.findIndex((number) => number !== 0);
  const fixed = nonZero === -1 ? stated.length : nonZero + 1;

  return stated.slice(0, fixed).every((number, at) => given.numbers[at] === number);
}

/**
 * Returns true when a version is lower than the lowest version a caret range admits.
 *
 * @remarks
 *   A prerelease is lower than the release of the same numbers, so `1.0.0-beta` is below `^1.0.0`.
 * @param range - The caret range.
 * @param version - The version to check.
 * @throws {@link TypeError} When the range is not a caret range or the version is not a version.
 */
export function below(range: string, version: string): boolean {
  const [stated, given] = operands("below", range, version);
  const order = compared(given.numbers, stated);

  return order < 0 || (order === 0 && given.prerelease);
}

/**
 * Returns a requirement on another plugin, at a caret range of its contract's version.
 *
 * @param contract - The contract of the plugin needed.
 * @param range - The caret range over that contract's version.
 * @param options - Whether the plugin runs without the plugin it needs.
 * @returns The requirement, with the needed contract's version where it states one.
 */
export function needs(contract: Versioned, range: CaretRange, options: Needing = {}): Requirement {
  return {
    pluginId: contract.pluginId,
    range,
    ...(contract.version === undefined ? {} : { version: contract.version }),
    ...(options.optional === true ? { optional: true } : {}),
  };
}
