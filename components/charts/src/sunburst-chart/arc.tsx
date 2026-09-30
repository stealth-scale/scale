/**
 * Renders one arc of a sunburst, which recharts clones with the arc's row and geometry: recharts'
 * sector in a group with the arc's place in the keyboard walk.
 *
 * @remarks
 *   The group has `data-walk` with the arc's place, and a gap has none, so the walk skips it. The
 *   arc at the chart's initial place opens the tooltip at itself after layout, because a place in
 *   the walk counts the arcs of every ring while recharts' `defaultIndex` counts one pie's sectors.
 */

import { type ReactElement, useRef } from "react";

import { Sector, type SectorProps } from "recharts";

import { useOpened } from "#chart/walk.ts";

/**
 * Describes what an arc receives: the sector's props from the row and the geometry recharts passes,
 * and the place the chart opens its tooltip at.
 */
export interface ArcProps extends SectorProps {
  /**
   * Place in the walk of the arc the tooltip opens at when the chart first renders, if any.
   */
  readonly initial?: number | undefined;

  /**
   * Place of the arc in the keyboard walk, none for a gap.
   */
  readonly walk?: number | undefined;
}

/**
 * Renders the arc's sector in a group with the arc's place in the walk.
 *
 * @param props - The arc's row and geometry, and the place the chart opens its tooltip at.
 */
export function Arc({ initial, walk, ...sector }: ArcProps): ReactElement {
  const group = useRef<SVGGElement>(null);

  useOpened(group, walk !== undefined && walk === initial);

  return (
    <g data-walk={walk} ref={group}>
      <Sector {...sector} />
    </g>
  );
}
