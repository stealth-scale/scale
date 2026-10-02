/**
 * Maps a schema's `format` to the kind of text box that takes it.
 */

/**
 * Describes the kinds of box a text field renders.
 */
export type TextKind = "email" | "password" | "text" | "url";

/**
 * Maps each format a text field renders a box of its own for to that box's `type`.
 */
const KINDS: Readonly<Record<string, TextKind>> = {
  email: "email",
  password: "password",
  uri: "url",
  url: "url",
};

/**
 * Returns the kind of box for a format: the box of its own, or a plain one for any other value.
 *
 * @param format - The value of the schema's `format`, or nothing.
 * @returns The box's `type`.
 */
export function kindOf(format?: unknown): TextKind {
  return typeof format === "string" ? (KINDS[format] ?? "text") : "text";
}
