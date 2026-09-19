/**
 * Writes a name the way an anchor takes it.
 */

/**
 * Returns a name as one word of letters and digits, for an anchor on a page.
 *
 * @remarks
 *   Every run of anything else becomes one hyphen, and letters keep their script, so a title in
 *   any language anchors. `Looks and sizes` becomes `looks-and-sizes`.
 * @param name - The name, as a title is written.
 * @returns The name in lower case with every run of punctuation and space as one hyphen.
 */
export function slugOf(name: string): string {
  return name.toLowerCase().replaceAll(/[^\p{L}\p{N}]+/gu, "-");
}
