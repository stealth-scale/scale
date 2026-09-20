/**
 * Writes a locale the way a reader looking for their own language reads it.
 */

/**
 * Matches the region and whatever follows the language in a tag.
 */
const AFTER_LANGUAGE = /-.*$/u;

/**
 * Writes a locale in its own language, `Nederlands` for `nl`, or the tag where the browser knows
 * no name for it.
 *
 * @remarks
 *   The browser is asked for the name alone rather than for the tag as a fallback, because a tag
 *   it cannot name is answered as itself either way and a malformed one throws, and both read
 *   back as the tag.
 * @param tag - The locale, as a BCP 47 tag.
 * @returns The language in itself, or the tag.
 */
export function endonymOf(tag: string): string {
  try {
    return new Intl.DisplayNames([tag], { fallback: "none", type: "language" }).of(tag) ?? tag;
  } catch {
    return tag;
  }
}

/**
 * Writes the mark a locale is known by at a glance: its language, in capitals.
 *
 * @param tag - The locale, as a BCP 47 tag.
 * @returns The language subtag in capitals, `NL` for `nl-BE`.
 */
export function markOf(tag: string): string {
  return tag.replace(AFTER_LANGUAGE, "").toUpperCase();
}
