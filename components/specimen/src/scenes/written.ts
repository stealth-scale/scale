/**
 * Writes the source of a generated scene from the props of its first cell.
 *
 * @remarks
 *   A generated scene has no declaration in the specimen file to show. Its source comes from an
 *   example module or from a snippet. An example contributes its whole file, with every
 *   `{...props}` spread replaced by the props of the first cell. A snippet contributes a tag name,
 *   optional children and optional imports. The source covers the first cell only, because the
 *   rendered cells already label every value. It writes every prop the first cell receives: the
 *   turned axis, the crossing axis and the fixed props.
 */

/**
 * Snippet the source of a generated scene is written from.
 */
export interface Snippet {
  /**
   * JSX children, indented one level inside the tag. Undefined for a self-closing tag.
   */
  readonly children?: string | undefined;

  /**
   * Import statement written above the tag.
   */
  readonly imports?: string | undefined;

  /**
   * Tag name, such as `Button` or `Card.Root`.
   */
  readonly name: string;
}

/**
 * Indentation of one nesting level.
 */
const STEP = "  ";

/**
 * Matches every `{...props}` spread, with the whitespace before it.
 */
const SPREAD = /\s\{\.\.\.props\}/gu;

/**
 * Matches the `props` parameter of a component, with its type annotation.
 */
const PARAMETER = /\(props(?::[^)]*)?\)/u;

/**
 * Writes one JSX attribute with a leading space.
 *
 * @remarks
 *   `true` becomes a bare attribute. `false` is written in braces, because an omitted attribute
 *   says nothing about the axis. A string is quoted, and any other value is written in braces.
 */
function attribute(axis: string, value: unknown): string {
  if (value === true) return ` ${axis}`;
  if (typeof value === "string") return ` ${axis}="${value}"`;

  return ` ${axis}={${String(value)}}`;
}

/**
 * Returns the attributes of every defined prop, each with a leading space.
 */
function attributes(props: Readonly<Record<string, unknown>>): string {
  return Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([axis, value]) => attribute(axis, value))
    .join("");
}

/**
 * Indents every non-empty line by one level.
 */
function nested(children: string): string {
  return children
    .split("\n")
    .map((line) => (line === "" ? line : `${STEP}${line}`))
    .join("\n");
}

/**
 * Writes the source of a scene from a snippet and the props of its first cell.
 *
 * @param snippet - Tag name, children and imports.
 * @param props - Props of the first cell, including the turned axis.
 * @returns The source, or undefined when there is no snippet or no prop is set.
 */
export function written(
  snippet: Snippet | undefined,
  props: Readonly<Record<string, unknown>>,
): string | undefined {
  const set = attributes(props);

  if (snippet === undefined || set === "") return undefined;

  const opened = `<${snippet.name}${set}`;
  const block =
    snippet.children === undefined
      ? `${opened} />`
      : `${opened}>\n${nested(snippet.children)}\n</${snippet.name}>`;

  return snippet.imports === undefined ? block : `${snippet.imports}\n\n${block}`;
}

/**
 * Writes the source of a scene from an example and the props of its first cell.
 *
 * @remarks
 *   The example component takes one parameter named `props` and spreads it with `{...props}`. The
 *   function replaces every spread with the attributes and removes the parameter, so the source
 *   reads as a standalone component. An example without a spread is returned unchanged.
 * @param source - Source text of the example module.
 * @param props - Props of the first cell, including the turned axis.
 * @returns The source with the props written in.
 */
export function propped(source: string, props: Readonly<Record<string, unknown>>): string {
  if (!source.includes("{...props}")) return source;

  return source.replaceAll(SPREAD, attributes(props)).replace(PARAMETER, "()");
}

/**
 * Writes the source of a scene from an example module and the props of its first cell.
 *
 * @param example - Namespace of the example module.
 * @param props - Props of the first cell, including the turned axis.
 * @returns The source, or undefined without an example or a string `source` export.
 */
export function sampled(
  example: object | undefined,
  props: Readonly<Record<string, unknown>>,
): string | undefined {
  return example !== undefined && "source" in example && typeof example.source === "string"
    ? propped(example.source, props)
    : undefined;
}
