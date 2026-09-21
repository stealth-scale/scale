/**
 * Rewrites one segment of a class name into the scheme's readable form.
 *
 * @remarks
 *   The compiler puts token references, function calls and spaces into a class name exactly as the
 *   author typed them, with a space as `_`, and a stylesheet has to escape every one of those
 *   characters. This module keeps letters, digits, hyphens, `%`, `/` and `!`, keeps the double
 *   underscore that separates a recipe from its slot, and collapses everything else to a single
 *   hyphen. The browser and the stylesheet rewrite both call {@link sanitise}, so a class name
 *   from either side lands on the same string.
 */

/**
 * The separator between a recipe's class and its slot's class.
 *
 * @remarks
 *   The only run of underscores the scheme preserves.
 */
const SLOT = "__";

/**
 * Matches a run of replaceable characters along with the hyphens on either side of it.
 *
 * @remarks
 *   Swallowing the surrounding hyphens is what turns `ar-{sizes.32}` into `ar-sizes-32` and
 *   `calc(100%_-_2rem)` into `calc-100%-2rem` rather than leaving doubled hyphens behind. A run of
 *   hyphens alone does not match, so the compiler's `m--4` for a negative value and this scheme's
 *   `button--lg` both survive.
 */
const RUN = /-*(?:[^\p{L}\p{N}%/!-]+-*)+/gu;

/**
 * Matches a run of replaceable characters at the start of a value, with any hyphens after it.
 *
 * @remarks
 *   The sanitiser deletes this match rather than replacing it, so the token reference `{sizes.32}`
 *   comes out as `sizes-32` and not `-sizes-32`. A leading hyphen is excluded from the class, so a
 *   negative value keeps its sign.
 */
const LEADING = /^(?:[^\p{L}\p{N}%/!-]+-*)+/u;

/**
 * Matches the hyphens a run leaves at the end of a segment, or in front of an importance mark.
 */
const TRAILING = /-+(?=!*$)/u;

/**
 * Matches the boundary between a lower-case letter or a digit and a capital letter.
 */
const CAMEL = /(?<=[a-z0-9])(?=[A-Z])/gu;

/**
 * Converts a camel-case name to kebab-case.
 */
export function kebab(name: string): string {
  return name.replaceAll(CAMEL, "-").toLowerCase();
}

/**
 * Collapses each run of characters a stylesheet would escape into one hyphen, and drops the runs
 * at the start and the end.
 *
 * @remarks
 *   The segment is split on {@link SLOT} first and rejoined afterwards, so the double underscore
 *   between a recipe and its slot is not itself collapsed.
 */
export function sanitise(segment: string): string {
  return segment
    .replace(LEADING, "")
    .split(SLOT)
    .map((part) => part.replaceAll(RUN, "-"))
    .join(SLOT)
    .replace(TRAILING, "");
}
