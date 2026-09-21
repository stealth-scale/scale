/**
 * Writes the source a built scene shows: the component as a consumer writes it, with the axis the
 * scene turns set to one of its values.
 *
 * @remarks
 *   The index cuts a scene's snippet out of the specimen's own text, and a scene built at runtime
 *   has no declaration to cut. What a reader wants from that panel is the line they would put in
 *   their own file, which is not the matrix wiring the cut would have given them either.
 *   One block rather than one per value. The drawing above the panel already names every value,
 *   once per cell, so repeating the whole component against each of them fills the panel with the
 *   same lines and leaves the reader to spot the one word that moved.
 *   Every prop the drawn cell receives is written: the axis the scene turns, the axis crossing it
 *   where one does, and the props the scene holds fixed. A snippet that named only the turned axis
 *   did not match the cell above it, which is the one thing a reader checks it against.
 *   The import line is the page's to state. The generator holds a string and a prop set and has no
 *   view of the file, so it cannot know that a card's children reach for a button.
 */

/**
 * Describes how a consumer writes the component.
 */
export interface Snippet {
  /**
   * The lines the component is written round, where it takes children. Written as a consumer would
   * write them and indented here, so a page states them the way they read.
   */
  readonly children?: string | undefined;

  /**
   * The import the snippet needs to compile, which a reader copies above it.
   */
  readonly imports?: string | undefined;

  /**
   * The tag, `Button` or `Card.Root`.
   */
  readonly name: string;
}

/**
 * The room one level of nesting takes.
 */
const STEP = "  ";

/**
 * Writes one attribute, as a word for a string and in braces for anything else.
 *
 * @remarks
 *   A switch that is on is written as the bare prop, which is how a reader writes it. One that is
 *   off is written out, because a line with nothing on it says nothing about the axis.
 */
function attribute(axis: string, value: unknown): string {
  if (value === true) return ` ${axis}`;
  if (typeof value === "string") return ` ${axis}="${value}"`;

  return ` ${axis}={${String(value)}}`;
}

/**
 * Moves every line of the children in by one step.
 */
function nested(children: string): string {
  return children
    .split("\n")
    .map((line) => (line === "" ? line : `${STEP}${line}`))
    .join("\n");
}

/**
 * Writes the source for one scene: the component once, carrying every prop the first cell draws
 * with, under whatever the page states it has to import.
 *
 * @param snippet - The tag, the lines it is written round, and the import it needs.
 * @param props - The props the first cell is drawn with, the turned axis among them.
 * @returns The block, or nothing where the page states no snippet or the cell draws with nothing.
 */
export function written(
  snippet: Snippet | undefined,
  props: Readonly<Record<string, unknown>>,
): string | undefined {
  const set = Object.entries(props).filter(([, value]) => value !== undefined);

  if (snippet === undefined || set.length === 0) return undefined;

  const attributes = set.map(([axis, value]) => attribute(axis, value)).join("");
  const opened = `<${snippet.name}${attributes}`;
  const block =
    snippet.children === undefined
      ? `${opened} />`
      : `${opened}>\n${nested(snippet.children)}\n</${snippet.name}>`;

  return snippet.imports === undefined ? block : `${snippet.imports}\n\n${block}`;
}
