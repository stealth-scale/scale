/**
 * Renders a value as the JavaScript source a generated file evaluates back into that value.
 *
 * @remarks
 *   JSON covers most generated configuration but cannot spell a regular expression. A function is
 *   refused, with the path it sat at, because a generated file is evaluated in another process and
 *   a function does not survive serialisation.
 */

/**
 * Returns true when an object is a plain object rather than a class instance, and narrows it to a
 * record.
 */
function plain(value: object): value is Readonly<Record<string, unknown>> {
  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/**
 * Returns the name to call a value by in the error that refuses it.
 *
 * @remarks
 *   An instance is called by its class name, so a `Date` is refused as a Date. An object whose
 *   prototype declares no constructor is called an object.
 */
function kindOf(value: unknown): string {
  if (typeof value !== "object" || value === null) return typeof value;

  const constructor: unknown = Reflect.get(value, "constructor");

  return typeof constructor === "function" ? constructor.name : "object";
}

/**
 * Lists the code points JSON leaves bare inside a string: line separator and paragraph separator.
 */
const SEPARATORS = [0x2028, 0x2029];

/**
 * Opens the unicode escape the separators are rewritten as.
 */
const ESCAPE = String.raw`\u`;

/**
 * Renders a string as a JavaScript string literal, with the two separators JSON leaves bare
 * escaped as well.
 *
 * @remarks
 *   JSON escapes everything a string literal needs escaped except the line and paragraph
 *   separators. Either one bare inside a literal was a syntax error before ES2019, and a code
 *   scanner reports it as unsanitised code. Every string a plugin writes into generated code goes
 *   through here and nowhere else.
 * @returns The literal, quotes included.
 */
export function quoted(text: string): string {
  let written = JSON.stringify(text);

  for (const point of SEPARATORS) {
    written = written.replaceAll(String.fromCodePoint(point), `${ESCAPE}${point.toString(16)}`);
  }

  return written;
}

/**
 * Renders a value that needs no recursion, and returns undefined for an array, a plain object or
 * anything the module refuses.
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
 * Renders the entries of a plain object as `key: value` pairs, dropping an entry whose value is
 * undefined.
 *
 * @remarks
 *   An optional field nothing set reads as undefined, and dropping the key matches what JSON does
 *   with it.
 */
function entries(value: Readonly<Record<string, unknown>>, path: string): string {
  return Object.entries(value)
    .filter(([, held]) => held !== undefined)
    .map(([key, held]) => `${quoted(key)}: ${literal(held, `${path}.${key}`)}`)
    .join(", ");
}

/**
 * Renders a value as source, descending into arrays and plain objects.
 *
 * @remarks
 *   Strings, finite numbers, booleans, null, undefined, regular expressions, arrays and plain
 *   objects are written, and everything else is refused. The path gives the position of the value
 *   inside the whole and opens the error message that refuses it.
 * @throws {@link Error} When the value, or anything inside it, is a function, a class instance, a
 *   symbol, a bigint or a number that is not finite.
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
