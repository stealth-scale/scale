/**
 * Renders the counts of a diff: the lines added and removed, such as "+3 −1".
 *
 * @remarks
 *   The counts are hidden from a screen reader, which hears `statLabel` in their place, "3 lines
 *   added, 1 line removed" unless stated. The added count takes the success ink and the removed
 *   count the error ink. The part reads the root's diff, so it renders anywhere inside the root,
 *   such as in the header's controls.
 */

import { type ComponentProps, type ReactElement } from "react";

import { VisuallyHidden } from "@stealthscale/component-a11y";

import { countsOf } from "#code-block/changes.ts";
import { withContext } from "#code-block/context.ts";
import { type DiffWords, diffWordsOf } from "#code-block/diff-words.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Renders the counts' `span` with the recipe's stat class.
 */
const Stat = withContext("span", "stat");

/**
 * Describes the props of `DiffStat`: the counts' words and the props of a `span`.
 */
export interface DiffStatProps extends ComponentProps<typeof Stat>, Pick<DiffWords, "statLabel"> {}

/**
 * Renders the diff's counts, and their words for a screen reader.
 *
 * @param props - The counts' words and the props of a `span`.
 */
export function DiffStat({ statLabel, ...rest }: DiffStatProps): ReactElement {
  const { changes } = useCode();
  const counts = countsOf(changes ?? []);

  return (
    <Stat {...rest}>
      <span aria-hidden data-kind="added">{`+${String(counts.added)}`}</span>
      <span aria-hidden data-kind="removed">{`−${String(counts.removed)}`}</span>
      <VisuallyHidden>{diffWordsOf({ statLabel }).statLabel(counts)}</VisuallyHidden>
    </Stat>
  );
}
