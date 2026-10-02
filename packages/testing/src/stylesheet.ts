/**
 * Reads a declaration out of a compiled stylesheet.
 *
 * @remarks
 *   A regular expression matches the rule the selector opens, because parsing the whole sheet
 *   would put a CSS parser in the test tier. A compiler writes a selector list where several
 *   selectors share a rule, so the match accepts the selector at any position in that list.
 */

/**
 * Lists every character a regular expression reads as syntax.
 */
const SYNTAX = /[$()*+.?[\\\]^{|}]/gu;

/**
 * Escapes a selector so a regular expression matches it literally.
 */
function literal(selector: string): string {
  return selector.replaceAll(SYNTAX, String.raw`\$&`);
}

/**
 * Returns the value one selector declares for a property, or undefined when it declares none.
 *
 * @param css - The compiled stylesheet.
 * @param selector - The selector, as the compiler wrote it, including its spacing.
 * @param property - The property, which may be a custom property.
 * @returns The value with its surrounding space removed, or undefined.
 */
export function declared(css: string, selector: string, property: string): string | undefined {
  const pattern = new RegExp(
    `(?:^|[\\n,{}])\\s*${literal(selector)}\\s*(?:,[^{}]*)?\\{[^{}]*?${literal(property)}:\\s*([^;}]+)`,
    "u",
  );

  return pattern.exec(css)?.[1]?.trim();
}
