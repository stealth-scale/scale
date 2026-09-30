/**
 * Renders the diff from the root's `before` to its code: unified, or side by side.
 *
 * @remarks
 *   The diff renders in a scroll area that scrolls sideways, named by `CodeBlock.Title` while one
 *   renders and by `label` otherwise. Unchanged lines more than `context` lines away from
 *   every change fold into a button that shows them, and `Infinity` shows every line. The button
 *   leaves the page once pressed, so focus moves to the first line it showed. Syntax inks and
 *   changed words render together. Where both versions are the same, or the root has no `before`,
 *   the diff renders `emptyLabel` in place of the lines.
 */

import {
  type ComponentProps,
  createElement,
  Fragment,
  type ReactElement,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#code-block/context.ts";
import { emptyOf, fillerOf, foldOf, keyOf, lineOf, type RowScope } from "#code-block/diff-rows.tsx";
import { type DiffWords, diffWordsOf } from "#code-block/diff-words.ts";
import { isFold, pairsOf, type Shown, shownOf } from "#code-block/folds.ts";
import { piecesOf } from "#code-block/segments.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Renders the scroll area's viewport with the recipe's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the diff's grid with the recipe's diff class, inside the scroll area's content, so the
 * grid's minimum width is the region's and its rows' tints reach the panel's end.
 */
const Lines = withContext("div", "diff");

/**
 * Describes the props of `Diff`: its view, its context, its region's name, its words, and the props
 * of a `div`.
 */
export interface DiffProps
  extends Omit<ComponentProps<typeof Lines>, "as" | "children">, Omit<DiffWords, "statLabel"> {
  /**
   * Unchanged lines shown on each side of a change. 3 unless stated, and `Infinity` for all.
   */
  readonly context?: number | undefined;

  /**
   * Accessible name of the scrolling region while no title renders. Defaults to `Changes`.
   */
  readonly label?: string | undefined;

  /**
   * `unified` interleaves the versions, and `split` puts them side by side. `unified` unless
   * stated.
   */
  readonly mode?: "split" | "unified" | undefined;

  /**
   * Whether changed words are marked inside a changed line. On unless stated.
   */
  readonly wordLevel?: boolean | undefined;
}

/**
 * Describes where the lines of a fold a person opened appear: after the element before its button.
 */
interface Opening {
  /**
   * Element before the fold's button, or null for a fold that starts the diff.
   */
  readonly previous: Element | null;

  /**
   * Element that contains the rows.
   */
  readonly rows: Element | null;

  /**
   * Index of the fold's first line among the diff's lines.
   */
  readonly start: number;
}

/**
 * Keeps the open folds, and moves focus to the first line of a fold once it shows as open.
 */
function useFolds(): [ReadonlySet<number>, RowScope["onOpen"]] {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const opening = useRef<null | Opening>(null);

  useLayoutEffect(() => {
    const place = opening.current;

    if (place === null || !open.has(place.start)) return;

    opening.current = null;
    const first =
      place.previous === null ? place.rows?.firstElementChild : place.previous.nextElementSibling;

    if (first instanceof HTMLElement) first.focus();
  }, [open]);

  return [
    open,
    (fold, event) => {
      opening.current = {
        previous: event.currentTarget.previousElementSibling,
        rows: event.currentTarget.parentElement,
        start: fold.start,
      };
      setOpen((current) => new Set(current).add(fold.start));
    },
  ];
}

/**
 * Renders the rows of a diff: unified, or pairs side by side.
 */
function rowsOf(scope: RowScope, rows: readonly Shown[], split: boolean): ReactNode[] {
  if (!split) {
    return rows.map((row) => (isFold(row) ? foldOf(row, scope) : lineOf(row, "both", scope)));
  }

  return pairsOf(rows).map((pair) =>
    isFold(pair) ? (
      foldOf(pair, scope)
    ) : (
      <Fragment key={`${keyOf(pair.before)}|${keyOf(pair.after)}`}>
        {pair.before === undefined ? fillerOf("before") : lineOf(pair.before, "before", scope)}
        {pair.after === undefined ? fillerOf("after") : lineOf(pair.after, "after", scope)}
      </Fragment>
    ),
  );
}

/**
 * Renders the diff in the code block's scroll area.
 *
 * @param props - The view, the context, the region's name, the words and the props of a `div`.
 * @returns The scroll area's root.
 */
export function Diff(props: DiffProps): ReactElement {
  const {
    addedLabel,
    context = 3,
    emptyLabel,
    expandLabel,
    label = "Changes",
    mode = "unified",
    removedLabel,
    wordLevel = true,
    ...rest
  } = props;
  const { before = "", changes = [], code, language, titled, titleId } = useCode();
  const [open, onOpen] = useFolds();
  const words = diffWordsOf({ addedLabel, emptyLabel, expandLabel, removedLabel });
  const rows = changes.every((line) => line.kind === "context")
    ? emptyOf(words.emptyLabel)
    : rowsOf(
        {
          after: piecesOf(code, language),
          before: piecesOf(before, language),
          firsts: new Set(Array.from(open, (start) => changes[start])),
          marks: wordLevel,
          onOpen,
          words,
        },
        shownOf(changes, context, open),
        mode === "split",
      );

  return createElement(
    ScrollArea.Root,
    { scrolls: "horizontal" },
    createElement(
      Viewport,
      titled ? { "aria-labelledby": titleId } : { "aria-label": label },
      createElement(
        ScrollArea.Content,
        null,
        createElement(Lines, { ...rest, "data-mode": mode }, rows),
      ),
    ),
    createElement(ScrollArea.Scrollbar, { orientation: "horizontal" }),
  );
}
