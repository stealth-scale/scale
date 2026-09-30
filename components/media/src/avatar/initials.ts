/**
 * Derives the initials an avatar's fallback shows from a name.
 */

/**
 * Splits a word into its user-perceived characters.
 */
const LETTERS = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/**
 * Returns the first user-perceived character of a word.
 */
function firstLetter(word: string): string {
  return Array.from(LETTERS.segment(word), (part) => part.segment)
    .slice(0, 1)
    .join("");
}

/**
 * Returns the initials of a name: the first letter of its first word and of its last word.
 *
 * @remarks
 *   A letter is a grapheme cluster, so a name that opens on a composed or accented letter keeps it
 *   whole. A name of one word returns one letter, and a blank name returns an empty string. The
 *   recipe sets the initials in capitals.
 * @param name - The name, as the root received it.
 * @returns Zero, one or two letters.
 */
export function initialsOf(name: string): string {
  const words = name.split(/\s+/u).filter((word) => word !== "");

  return [...words.slice(0, 1), ...words.slice(1).slice(-1)]
    .map((word) => firstLetter(word))
    .join("");
}
