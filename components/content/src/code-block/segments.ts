/**
 * Cuts the highlighter's tokens of a text into lines, and a line's tokens at the stretches a diff
 * marks, so a line keeps its syntax inks and its changed words together.
 *
 * @remarks
 *   The highlighter tokenizes a whole version at once, so a string or a comment that spans lines
 *   keeps its kind on every line. Its tokens join back to the text exactly, and an unclassified
 *   token may span a line break, so the tokens are cut at every break. A segment is the overlap of
 *   one token and one stretch, with the token's kind and whether the stretch changed. Consecutive
 *   segments of one changed stretch form one group, so a changed stretch across several tokens
 *   renders as one mark.
 */

import { tokenize } from "@tanstack/highlight";

import { type DiffRun } from "#code-block/changes.ts";

/**
 * Describes a piece of one line's text with the highlighter's kind for it.
 */
export interface Piece {
  /**
   * Highlighter's kind of the piece, such as `keyword`, absent for unclassified text.
   */
  readonly kind?: string | undefined;

  /**
   * The piece's text.
   */
  readonly text: string;
}

/**
 * Describes a piece of a line's text with its kind and whether the diff marks it as changed.
 */
export interface Segment extends Piece {
  /**
   * Whether the diff marks the piece as a changed word.
   */
  readonly changed: boolean;
}

/**
 * Returns the pieces of each line of a text, from the highlighter's tokens.
 *
 * @param code - A whole version of the text.
 * @param language - The highlighter's name of the language, or undefined for plain text.
 */
export function piecesOf(code: string, language?: string): Piece[][] {
  const { tokens } = tokenize(code, language === undefined ? {} : { lang: language });
  const lines: Piece[][] = [[]];

  for (const token of tokens) {
    token.value.split("\n").forEach((text, index) => {
      if (index > 0) lines.push([]);

      if (text !== "") lines.at(-1)?.push({ kind: token.className, text });
    });
  }

  return lines;
}

/**
 * Returns a line's segments: each piece cut where a stretch of the diff begins or ends.
 *
 * @param pieces - The line's pieces.
 * @param runs - The line's stretches, whose texts join to the same line.
 */
export function segmentsOf(pieces: readonly Piece[], runs: readonly DiffRun[]): Segment[] {
  const segments: Segment[] = [];
  let run = 0;
  let offset = 0;

  for (const piece of pieces) {
    let rest = piece.text;

    while (rest !== "") {
      const stretch = runs[run];
      const left = stretch === undefined ? rest.length : stretch.text.length - offset;
      const taken = rest.slice(0, left);

      segments.push({ changed: stretch?.changed ?? false, kind: piece.kind, text: taken });
      rest = rest.slice(taken.length);
      offset += taken.length;

      if (stretch !== undefined && offset >= stretch.text.length) {
        run += 1;
        offset = 0;
      }
    }
  }

  return segments;
}

/**
 * Describes consecutive segments of a line that are all changed or all kept.
 */
export interface Group {
  /**
   * Whether the group's segments changed.
   */
  readonly changed: boolean;

  /**
   * The group's segments, in the order of the line.
   */
  readonly segments: Segment[];
}

/**
 * Returns a line's segments in groups of consecutive segments that are all changed or all kept.
 */
export function groupsOf(segments: readonly Segment[]): Group[] {
  const groups: Group[] = [];

  for (const segment of segments) {
    const last = groups.at(-1);

    if (last?.changed === segment.changed) last.segments.push(segment);
    else groups.push({ changed: segment.changed, segments: [segment] });
  }

  return groups;
}
