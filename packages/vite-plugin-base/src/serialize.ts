/**
 * Writes a value as the JavaScript source that reproduces it, for a file a plugin generates.
 *
 * @remarks
 *   JSON would do for most generated configuration and drops what JSON cannot spell, such as a
 *   regular expression. A function is refused with the path it sat at, because a generated file is
 *   evaluated in another process and a function would not survive the trip.
 */

/**
 * Reports whether an object is plain: made by a literal, or with no prototype at all.
 */
function plain(value: object): value is Readonly<Record<string, unknown>> {
  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/**
 * Describes what kind of thing a value is, for the sentence that refuses it.
 *
 * @remarks
 *   An instance is described by its class name, so a `Date` is refused as a Date. An object whose
 *   prototype declares no constructor is described as an object.
 */
function kindOf(value: unknown): string {
  if (typeof value !== "object" || value === null) return typeof value;

  const constructor: unknown = Reflect.get(value, "constructor");

  return typeof constructor === "function" ? constructor.name : "object";
}

/**
 * The code points of the line separator and the paragraph separator, which JSON leaves bare in a
 * string.
 */
const SEPARATORS = [0x2028, 0x2029];

/**
 * The opening of a unicode escape in a string literal, which the separators are written as.
 */
const ESCAPE = String.raw`\u`;

/**
 * Writes a string as a JavaScript string literal.
 *
 * @remarks
 *   JSON escapes everything a string literal needs escaped except the line and paragraph
 *   separators, which it leaves bare. A source file holding either bare inside a literal was a
 *   syntax error before ES2019 and is what a code scanner reads as unsanitised code, so the two are
 *   escaped after. A string a plugin writes into generated code goes through this and nothing else.
 * @param text - The string to write.
 * @returns The literal, with its quotes.
 */
export function quoted(text: string): string {
  let written = JSON.stringify(text);

  for (const point of SEPARATORS) {
    written = written.replaceAll(String.fromCodePoint(point), `${ESCAPE}${point.toString(16)}`);
  }

  return written;
}

/**
 * Writes a value that needs no descent, and returns undefined for one that does or that is refused.
 */
function scalar(value: unknown): string | undefined {
  if (typeof value === "string") return quoted(value);
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (value instanceof RegExp) return value.toString();

  return undefined;
}

/**
 * Writes the entries of a plain object, leaving out one whose value is undefined.
 *
 * @remarks
 *   A key holding undefined is what an optional field reads as when nothing set it, and JSON
 *   leaves it out for the same reason.
 */
function entries(value: Readonly<Record<string, unknown>>, path: string): string {
  return Object.entries(value)
    .filter(([, held]) => held !== undefined)
    .map(([key, held]) => `${quoted(key)}: ${literal(held, `${path}.${key}`)}`)
    .join(", ");
}

/**
 * Writes a value as source.
 *
 * @remarks
 *   Strings, finite numbers, booleans, null, undefined, regular expressions, arrays and plain
 *   objects are written. Everything else is refused. The path names where the value sits in the
 *   whole, and opens the sentence that refuses it.
 * @throws {@link Error} When the value, or anything inside it, is a function, an instance of a
 *   class, a symbol, a bigint or a number that is not finite.
 */
export function literal(value: unknown, path = "value"): string {
  const written = scalar(value);

  if (written !== undefined) return written;

  if (Array.isArray(value)) {
    return `[${value.map((held, index) => literal(held, `${path}[${String(index)}]`)).join(", ")}]`;
  }

  if (typeof value === "object" && value !== null && plain(value)) {
    return `{${entries(value, path)}}`;
  }

  throw new Error(`${path} is of kind ${kindOf(value)} and cannot be written as source`);
}
