/**
 * Renders a chord diagram's readout: the kit's tooltip in the middle of the ring, which writes what
 * the mark the pointer or the walk is at sends and receives.
 *
 * @remarks
 *   The readout stays in the middle of the ring, where the ribbons cross, so it covers no arc and
 *   no name while the pointer moves over the diagram. Recharts shows its tooltip only for its own
 *   marks, so the diagram renders the kit's tooltip in a `foreignObject` over the plot's box,
 *   inside the plot's center part. The tooltip is active throughout and writes nothing while the
 *   readout is at no mark, and the recipe makes its empty panel transparent. It is an assertive
 *   `output` that is in the document before the first mark, so a screen reader announces each step
 *   of the walk. The pointer passes through the readout to the ribbons under it.
 */

import { type ReactElement } from "react";

import { withContext } from "#chart/context.ts";
import { Tooltip, type TooltipEntry } from "#chart/tooltip.tsx";
import { type ChordWords, readoutOf } from "#chord-diagram/facts.ts";
import { type Mark } from "#chord-diagram/marks.ts";
import { type Area } from "#chord-diagram/paths.ts";

/**
 * Renders the `div` over the middle of the plot, which centers the tooltip.
 */
const Center = withContext("div", "center");

/**
 * Lists the one entry the kit's tooltip needs before it writes a heading and rows.
 */
const ENTRY: readonly TooltipEntry[] = [{}];

/**
 * Describes the props of the readout: the plot's box, the mark and what writes about it.
 */
export interface ReadoutProps {
  /**
   * Box of the plot, which the readout covers.
   */
  readonly area: Area;

  /**
   * Mark the readout is at, if any.
   */
  readonly mark: Mark | undefined;

  /**
   * Words for what a node sends and for what it receives.
   */
  readonly words: ChordWords;

  /**
   * Writes an amount in the chart's locale.
   */
  readonly write: (value: unknown) => string;
}

/**
 * Renders the kit's tooltip in the middle of the plot, with what the mark sends and receives while
 * the readout is at a mark.
 *
 * @param props - The plot's box, the mark and the writers.
 */
export function Readout({ area, mark, words, write }: ReadoutProps): ReactElement {
  const readout = mark === undefined ? undefined : readoutOf(mark, words, write);

  return (
    <foreignObject
      height={area.height}
      pointerEvents="none"
      width={area.width}
      x={area.x}
      y={area.y}
    >
      <Center>
        <Tooltip
          active
          label={readout?.heading}
          payload={ENTRY}
          rowsOf={() => readout?.rows ?? []}
        />
      </Center>
    </foreignObject>
  );
}
