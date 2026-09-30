/**
 * Parses terminal output into runs of text, each with the SGR style in force where it was printed.
 *
 * @remarks
 *   Only SGR sequences style the text: the eight colours and their bright twins, bold, dim,
 *   underline and the resets. Every other control sequence, operating system command and escape is
 *   dropped, so no escape renders as a glyph. A style applies until a sequence changes it, across
 *   line breaks, as in a terminal. A colour is a name, so the theme decides how it renders in each
 *   colour mode.
 */

/**
 * Language name that makes `CodeBlock.Code` render terminal output.
 */
export const ANSI = "ansi";

/**
 * Lists the eight SGR colours in code order: 30 to 37, and 90 to 97 for the bright twins.
 */
const COLORS = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const;

/**
 * Selects one of the eight SGR colours.
 */
export type AnsiColor = (typeof COLORS)[number];

/**
 * Describes one run of terminal output and the style in force where it was printed.
 */
export interface AnsiSpan {
  /**
   * Whether the run is bold.
   */
  readonly bold: boolean;

  /**
   * Colour of the run, or undefined for the default ink.
   */
  readonly color: AnsiColor | undefined;

  /**
   * Whether the run is dim.
   */
  readonly dim: boolean;

  /**
   * Text of the run, line breaks included.
   */
  readonly text: string;

  /**
   * Whether the run is underlined.
   */
  readonly underline: boolean;
}

/**
 * Describes the style an SGR sequence sets: every field of a run except its text.
 */
type Style = Omit<AnsiSpan, "text">;

/**
 * Matches one escape: an SGR sequence with its parameters in the first group, any other control
 * sequence, an operating system command up to its terminator or the end of the text, or a
 * two-character escape.
 */
const ESCAPE =
  // eslint-disable-next-line no-control-regex -- every escape starts with the ESC control character
  /\u001B\[([\d:;]*)m|\u001B\[[0-?]*[ -/]*[@-~]|\u001B\][^\u0007\u001B]*(?:\u0007|\u001B\\|$)|\u001B[ -/]*[0-~]/gu;

/**
 * Style of text no sequence has styled: the default ink, not bold, not dim, not underlined.
 */
const PLAIN: Style = { bold: false, color: undefined, dim: false, underline: false };

/**
 * Maps each SGR code the parser reads to the fields it sets.
 *
 * @remarks
 *   An extended colour (38) renders in the default ink, because a theme has no ink for an arbitrary
 *   colour. The parser ignores a background colour and an underline colour.
 */
const CODES: ReadonlyMap<number, Partial<Style>> = new Map<number, Partial<Style>>([
  [0, PLAIN],
  [1, { bold: true }],
  [2, { dim: true }],
  [4, { underline: true }],
  [22, { bold: false, dim: false }],
  [24, { underline: false }],
  [38, { color: undefined }],
  [39, { color: undefined }],
  ...COLORS.flatMap((color, index): Array<[number, Partial<Style>]> => [
    [30 + index, { color }],
    [90 + index, { color }],
  ]),
]);

/**
 * Lists the codes that take an extended colour: text (38), background (48) and underline (58).
 */
const EXTENDED: ReadonlySet<number> = new Set([38, 48, 58]);

/**
 * Returns true when two styles set the same fields.
 */
function same(one: Style, other: Style): boolean {
  return (
    one.bold === other.bold &&
    one.color === other.color &&
    one.dim === other.dim &&
    one.underline === other.underline
  );
}

/**
 * Returns true when a run renders in the default ink with no effect.
 */
export function isPlain(span: AnsiSpan): boolean {
  return same(span, PLAIN);
}

/**
 * Counts the parameters after a code that belong to it: two after an extended colour's 5 (an index
 * into 256 colours), four after its 2 (a direct colour), and none otherwise.
 */
function argumentsOf(code: number, kind: number | undefined): number {
  if (!EXTENDED.has(code)) return 0;
  if (kind === 5) return 2;

  return kind === 2 ? 4 : 0;
}

/**
 * Applies the codes of one SGR sequence to a style, in order.
 *
 * @remarks
 *   An empty parameter reads as 0, so `ESC[m` resets. A parameter with colon sub-parameters reads
 *   as its first number, and a code the parser does not read changes nothing.
 */
function styled(style: Style, parameters: string): Style {
  const codes = parameters.split(";").map((parameter) => Number(parameter.split(":", 1)[0]));
  const next = { ...style };
  let skipped = 0;

  for (const [index, code] of codes.entries()) {
    if (skipped > 0) {
      skipped -= 1;
    } else {
      Object.assign(next, CODES.get(code));
      skipped = argumentsOf(code, codes[index + 1]);
    }
  }

  return next;
}

/**
 * Appends text in a style, merged into the last run when that run has the same style.
 */
function append(spans: AnsiSpan[], style: Style, text: string): void {
  if (text === "") return;
  const last = spans.at(-1);

  if (last !== undefined && same(last, style)) {
    spans[spans.length - 1] = { ...last, text: `${last.text}${text}` };
  } else {
    spans.push({ ...style, text });
  }
}

/**
 * Splits terminal output into runs of text, each with the SGR style in force where it was printed.
 *
 * @remarks
 *   Neighbouring runs of one style merge, so a dropped sequence never splits a word. A text without
 *   escapes returns one plain run, and an empty text returns none.
 */
export function parseAnsi(text: string): readonly AnsiSpan[] {
  const spans: AnsiSpan[] = [];
  let style = PLAIN;
  let at = 0;

  for (const match of text.matchAll(ESCAPE)) {
    append(spans, style, text.slice(at, match.index));
    at = match.index + match[0].length;
    const [, parameters] = match;

    if (parameters !== undefined) style = styled(style, parameters);
  }

  append(spans, style, text.slice(at));

  return spans;
}

/**
 * Removes every escape from terminal output, which leaves the text a person reads and copies.
 */
export function stripAnsi(text: string): string {
  return text.replaceAll(ESCAPE, "");
}
