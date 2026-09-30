/**
 * Renders the rows of a diff: a line with its numbers, its mark and its text, a fold a person
 * opens, the empty side of a side-by-side pair, and the words for a diff without changes.
 *
 * @remarks
 *   A changed line shows a `+` or `−` mark that a screen reader skips, and states what happened in
 *   visually hidden words beside it. The mark and the words take no selection, and neither do the
 *   line numbers, which a screen reader skips too. The text keeps the highlighter's kind on every
 *   token, and a run of changed words renders in one `ins` on an added line and one `del` on a
 *   removed one. The first line of an open fold takes focus from a script only, so the diff moves
 *   focus to it when the fold's button leaves the page.
 */

import { Fragment, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { VisuallyHidden } from "@stealthscale/component-a11y";

import { type DiffKind, type DiffLine } from "#code-block/changes.ts";
import { withContext } from "#code-block/context.ts";
import { type Words } from "#code-block/diff-words.ts";
import { type Fold } from "#code-block/folds.ts";
import { type Group, groupsOf, type Piece, segmentsOf } from "#code-block/segments.ts";

/**
 * Renders a line's row with the recipe's line class.
 */
const Line = withContext("div", "line");

/**
 * Renders a line number with the recipe's number class.
 */
const LineNumber = withContext("span", "number");

/**
 * Renders a line's `+` or `−` and its words with the recipe's mark class.
 */
const Mark = withContext("span", "mark");

/**
 * Renders a line's text with the recipe's text class.
 */
const Text = withContext("span", "text");

/**
 * Renders a word an added line gained with the recipe's change class.
 */
const Inserted = withContext("ins", "change");

/**
 * Renders a word a removed line lost with the recipe's change class.
 */
const Deleted = withContext("del", "change");

/**
 * Renders a fold's button with the recipe's fold class.
 */
const Folded = withContext("button", "fold");

/**
 * Renders the empty side of a pair with the recipe's filler class.
 */
const Filler = withContext("div", "filler");

/**
 * Renders the words of a diff without changes with the recipe's empty class.
 */
const Empty = withContext("div", "empty");

/**
 * Describes what every row of a diff reads.
 */
export interface RowScope {
  /**
   * Pieces of each line of the later version.
   */
  readonly after: readonly Piece[][];

  /**
   * Pieces of each line of the earlier version.
   */
  readonly before: readonly Piece[][];

  /**
   * First line of each open fold, which takes focus from a script.
   */
  readonly firsts: ReadonlySet<DiffLine | undefined>;

  /**
   * Whether changed words are marked inside a changed line.
   */
  readonly marks: boolean;

  /**
   * Opens a fold from its button's press.
   */
  readonly onOpen: (fold: Fold, event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Words of the diff, with every default applied.
   */
  readonly words: Words;
}

/**
 * Lists the mark of each kind of line.
 */
const MARKS: Readonly<Record<DiffKind, string>> = { added: "+", context: " ", removed: "−" };

/**
 * Returns a line's key: its numbers in both versions.
 */
export function keyOf(line?: DiffLine): string {
  return `${String(line?.before ?? "-")}:${String(line?.after ?? "-")}`;
}

/**
 * Keys each node by its place, because a piece of a line has no identity beyond its place.
 */
function placed(nodes: readonly ReactNode[]): ReactNode[] {
  return nodes.map((node, index) => (
    // eslint-disable-next-line react/no-array-index-key -- A piece of a line has no identity beyond its place, and the line renders whole.
    <Fragment key={index}>{node}</Fragment>
  ));
}

/**
 * Renders a piece of a line: its text, in a `span` with its kind where the highlighter gave one.
 */
function tokenOf(piece: Piece): ReactNode {
  return piece.kind === undefined ? piece.text : <span data-token={piece.kind}>{piece.text}</span>;
}

/**
 * Renders a group of segments: its tokens, inside one `ins` or `del` where the group changed.
 */
function groupOf(group: Group, kind: DiffKind): ReactNode {
  const tokens = placed(group.segments.map((segment) => tokenOf(segment)));

  if (!group.changed) return tokens;

  return kind === "added" ? <Inserted>{tokens}</Inserted> : <Deleted>{tokens}</Deleted>;
}

/**
 * Renders a line's text: its version's pieces cut at its changed words, or a line break for an
 * empty line, which a copy of the diff keeps as an empty line.
 */
function textOf(line: DiffLine, scope: RowScope): ReactNode {
  const [lines, number] =
    line.kind === "added" ? [scope.after, line.after] : [scope.before, line.before];
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A line's number in the version it comes from is set, and that version has the line.
  const pieces = lines[(number as number) - 1] as readonly Piece[];
  const segments = segmentsOf(pieces, scope.marks ? line.runs : []);

  if (segments.length === 0) return <br />;

  return placed(groupsOf(segments).map((group) => groupOf(group, line.kind)));
}

/**
 * Renders a line with both versions' numbers where `side` is `both`, and with the number of the
 * version whose column `side` names otherwise.
 */
export function lineOf(
  line: DiffLine,
  side: "after" | "before" | "both",
  scope: RowScope,
): ReactElement {
  const word = line.kind === "added" ? scope.words.addedLabel : scope.words.removedLabel;
  const first = side !== "after" && scope.firsts.has(line);

  return (
    <Line data-kind={line.kind} key={`${side}-${keyOf(line)}`} tabIndex={first ? -1 : undefined}>
      {side === "after" ? null : <LineNumber aria-hidden>{line.before}</LineNumber>}
      {side === "before" ? null : <LineNumber aria-hidden>{line.after}</LineNumber>}
      <Mark>
        <span aria-hidden>{MARKS[line.kind]}</span>
        {line.kind === "context" ? null : <VisuallyHidden>{`${word} `}</VisuallyHidden>}
      </Mark>
      <Text>{textOf(line, scope)}</Text>
    </Line>
  );
}

/**
 * Renders a fold: a button named by the lines it hides, which shows them.
 */
export function foldOf(fold: Fold, scope: RowScope): ReactElement {
  return (
    <Folded
      key={`fold-${String(fold.start)}`}
      onClick={(event) => {
        scope.onOpen(fold, event);
      }}
      type="button"
    >
      {scope.words.expandLabel(fold.count)}
    </Folded>
  );
}

/**
 * Renders the empty side of a pair.
 */
export function fillerOf(key: string): ReactElement {
  return <Filler aria-hidden key={key} />;
}

/**
 * Renders the words of a diff without changes.
 */
export function emptyOf(label: string): ReactElement {
  return <Empty>{label}</Empty>;
}
