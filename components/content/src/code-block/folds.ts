/**
 * Folds the unchanged lines of a diff that lie far from every change, and pairs the lines of a
 * diff for a side-by-side view.
 *
 * @remarks
 *   Every changed line shows with `context` unchanged lines on each side, and each longer run of
 *   unchanged lines folds into one row a person opens. An open fold shows its lines. `Infinity`
 *   shows every line. Side by side, a run of removed lines pairs with the run of added lines after
 *   it, line by line, and the shorter side is padded, so both columns keep one row per pair. An
 *   unchanged line and a fold take both columns.
 */

import { type DiffLine } from "#code-block/changes.ts";

/**
 * Describes a run of unchanged lines folded into one row.
 */
export interface Fold {
  /**
   * Number of lines the fold hides.
   */
  readonly count: number;

  /**
   * Index of the first hidden line among the diff's lines, which names the fold.
   */
  readonly start: number;
}

/**
 * Describes one row a diff shows: a line or a fold.
 */
export type Shown = DiffLine | Fold;

/**
 * Describes one row of a side-by-side diff: the earlier version's line and the later version's.
 */
export interface Pair {
  /**
   * Line of the later version, absent where only the earlier version has one.
   */
  readonly after?: DiffLine | undefined;

  /**
   * Line of the earlier version, absent where only the later version has one.
   */
  readonly before?: DiffLine | undefined;
}

/**
 * Returns whether a row is a fold.
 */
export function isFold(row: Fold | Pair | Shown): row is Fold {
  return "count" in row;
}

/**
 * Returns the indices of the lines within `context` lines of a change.
 */
function nearOf(lines: readonly DiffLine[], context: number): Set<number> {
  if (!Number.isFinite(context)) return new Set(lines.keys());

  const near = new Set<number>();

  lines.forEach((line, index) => {
    if (line.kind === "context") return;

    for (let at = index - context; at <= index + context; at += 1) near.add(at);
  });

  return near;
}

/**
 * Returns the rows a diff shows: each line near a change, and a fold for each other run of
 * unchanged lines that is not open.
 *
 * @param lines - The diff's lines.
 * @param context - Unchanged lines shown on each side of a change.
 * @param open - The folds a person opened, by their first line's index.
 */
export function shownOf(
  lines: readonly DiffLine[],
  context: number,
  open: ReadonlySet<number>,
): Shown[] {
  const near = nearOf(lines, context);
  const shown: Shown[] = [];
  let hidden: DiffLine[] = [];
  let start = 0;

  /**
   * Writes the run of lines far from a change: the lines where their fold is open, else a fold.
   */
  const flush = (): void => {
    if (hidden.length === 0) return;

    if (open.has(start)) shown.push(...hidden);
    else shown.push({ count: hidden.length, start });

    hidden = [];
  };

  lines.forEach((line, index) => {
    if (near.has(index)) {
      flush();
      shown.push(line);

      return;
    }

    if (hidden.length === 0) start = index;

    hidden.push(line);
  });
  flush();

  return shown;
}

/**
 * Returns the rows of a side-by-side diff: a pair per unchanged line, a pair per removed and added
 * line of one change, and each fold.
 *
 * @param shown - The rows the diff shows.
 */
export function pairsOf(shown: readonly Shown[]): Array<Fold | Pair> {
  const pairs: Array<Fold | Pair> = [];
  let removed: DiffLine[] = [];
  let added: DiffLine[] = [];

  /**
   * Writes the pairs of the change read so far, padding the shorter side.
   */
  const flush = (): void => {
    for (let at = 0; at < Math.max(removed.length, added.length); at += 1) {
      pairs.push({ after: added[at], before: removed[at] });
    }

    removed = [];
    added = [];
  };

  for (const row of shown) {
    if (isFold(row) || row.kind === "context") {
      flush();
      pairs.push(isFold(row) ? row : { after: row, before: row });
    } else if (row.kind === "removed") removed.push(row);
    else added.push(row);
  }

  flush();

  return pairs;
}
