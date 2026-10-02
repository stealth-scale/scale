/**
 * Renders a chord diagram's marks inside recharts' chart: a ribbon per pair of nodes, the arcs over
 * them, and the readout in the middle of the ring.
 *
 * @remarks
 *   The diagram reads the plot's box from recharts and keeps the place of the mark the readout is
 *   at: the place `defaultIndex` names at first, then the mark the pointer enters or the walk steps
 *   to. A mark the pointer leaves clears the readout only while the readout is at that mark, so a
 *   step of the walk survives a pointer resting elsewhere. A ribbon takes the color of the node
 *   that sends more, and each mark's trace tells the recipe to lift or fade it.
 */

import { type ReactElement, useState } from "react";

import { usePlotArea } from "recharts";

import { FLOW } from "#chart/recipe.ts";
import { Arc } from "#chord-diagram/arc.tsx";
import { type ChordWords } from "#chord-diagram/facts.ts";
import { type Mark, traceOf } from "#chord-diagram/marks.ts";
import { ribbonPath, ringOf } from "#chord-diagram/paths.ts";
import { Readout } from "#chord-diagram/readout.tsx";

/**
 * Describes the props of the diagram's marks: the marks, their colors, the initial place and the
 * readout's writers.
 */
export interface ChordsProps {
  /**
   * Returns the CSS value of a node's color by its key.
   */
  readonly colorOf: (key: string) => string;

  /**
   * Place in the walk of the mark the readout is at when the chart first renders, if any.
   */
  readonly initial: number | undefined;

  /**
   * Marks in the walk's order.
   */
  readonly marks: readonly Mark[];

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
 * Renders the ribbons, the arcs and the readout, or nothing outside a recharts chart.
 *
 * @param props - The marks, the colors, the initial place and the writers.
 */
export function Chords({
  colorOf,
  initial,
  marks,
  words,
  write,
}: ChordsProps): null | ReactElement {
  const area = usePlotArea();
  const [place, setPlace] = useState(initial);

  if (area === undefined) return null;

  const ring = ringOf(area);
  const active = marks.find((mark) => mark.walk === place);

  /**
   * Returns the handler that moves the readout to a mark.
   */
  const enter = (walk: number) => (): void => {
    setPlace(walk);
  };

  /**
   * Returns the handler that clears the readout while it is at a mark.
   */
  const leave = (walk: number) => (): void => {
    setPlace((current) => (current === walk ? undefined : current));
  };

  return (
    <>
      {marks.map((mark) =>
        mark.kind === "ribbon" ? (
          <path
            className={FLOW}
            d={ribbonPath(mark.ribbon, ring.centre, ring.ends)}
            data-trace={traceOf(mark, active)}
            data-walk={mark.walk}
            fill={colorOf(mark.dominant)}
            key={mark.walk}
            onMouseEnter={enter(mark.walk)}
            onMouseLeave={leave(mark.walk)}
          />
        ) : null,
      )}
      {marks.map((mark) =>
        mark.kind === "arc" ? (
          <Arc
            color={colorOf(mark.group.key)}
            key={mark.walk}
            mark={mark}
            onEnter={enter(mark.walk)}
            onLeave={leave(mark.walk)}
            ring={ring}
            trace={traceOf(mark, active)}
          />
        ) : null,
      )}
      <Readout area={area} mark={active} words={words} write={write} />
    </>
  );
}
