/**
 * Resolves a chord diagram's layout into the marks it renders, in the keyboard walk's order: each
 * arc in the nodes' order, then the ribbons whose source end is on it.
 *
 * @remarks
 *   A ribbon takes the color of the node that sends more, the source's on a tie, so its color is
 *   the net direction of the pair. While the readout is at a mark, the ribbons of that mark are
 *   lit, every other ribbon and every other arc are dimmed, and the arc the readout is at keeps its
 *   color. The ribbons of an arc are the ribbons with an end on its node.
 */

import { type ChartColor } from "#chart/colors.ts";
import { chordLayout, type ChordRibbon, type ChordSpan } from "#chord-diagram/layout.ts";
import { flowBalance, type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";

/**
 * Describes a node's arc as the diagram renders it.
 */
export interface ArcMark {
  /**
   * Palette the node states, if any.
   */
  readonly color: ChartColor | undefined;

  /**
   * Span of the circle the arc takes, as long as what the node sends.
   */
  readonly group: ChordSpan;

  /**
   * Sum of the counted flows into the node.
   */
  readonly inflow: number;

  /**
   * Kind of mark.
   */
  readonly kind: "arc";

  /**
   * Name written beside the arc: the node's label, else its key.
   */
  readonly title: string;

  /**
   * Place of the arc in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Describes a ribbon as the diagram renders it.
 */
export interface RibbonMark {
  /**
   * Key of the node that sends more, whose color the ribbon takes.
   */
  readonly dominant: string;

  /**
   * Kind of mark.
   */
  readonly kind: "ribbon";

  /**
   * The ribbon's two ends.
   */
  readonly ribbon: ChordRibbon;

  /**
   * Name of the source's node, then the name of the target's.
   */
  readonly titles: readonly [string, string];

  /**
   * Place of the ribbon in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Describes a mark of a chord diagram.
 */
export type Mark = ArcMark | RibbonMark;

/**
 * Describes how the recipe paints a mark while the readout is at a mark: a lit ribbon lifts, a
 * dimmed mark fades, and a mark without a trace rests.
 */
export type Trace = "dimmed" | "lit" | undefined;

/**
 * Returns the ribbon's mark at its place in the walk.
 *
 * @param ribbon - The ribbon's two ends.
 * @param titleOf - Returns a node's name from its key.
 * @param walk - The ribbon's place in the walk.
 */
function ribbonMarkOf(
  ribbon: ChordRibbon,
  titleOf: (key: string) => string,
  walk: number,
): RibbonMark {
  const { source, target } = ribbon;

  return {
    dominant: target.value > source.value ? target.key : source.key,
    kind: "ribbon",
    ribbon,
    titles: [titleOf(source.key), titleOf(target.key)],
    walk,
  };
}

/**
 * Returns the diagram's marks in the walk's order: each arc, then the ribbons whose source end is
 * on it.
 *
 * @param nodes - The nodes in the order their arcs follow each other.
 * @param flows - The flows between them.
 */
export function marksOf(nodes: readonly SankeyNode[], flows: readonly SankeyFlow[]): Mark[] {
  const { groups, ribbons } = chordLayout(nodes, flows);
  const marks: Mark[] = [];

  /**
   * Returns the first node with a key.
   */
  const nodeOf = (key: string): SankeyNode | undefined => nodes.find((node) => node.key === key);

  /**
   * Returns a node's name: its label, else its key.
   */
  const titleOf = (key: string): string => nodeOf(key)?.label ?? key;

  for (const { inflow, key } of flowBalance(nodes, flows)) {
    const group = groups.find((each) => each.key === key);

    if (group === undefined) continue;

    marks.push({
      color: nodeOf(key)?.color,
      group,
      inflow,
      kind: "arc",
      title: titleOf(key),
      walk: marks.length,
    });

    for (const ribbon of ribbons.filter((each) => each.source.key === key)) {
      marks.push(ribbonMarkOf(ribbon, titleOf, marks.length));
    }
  }

  return marks;
}

/**
 * Returns how the recipe paints a mark while the readout is at the mark or at another one.
 *
 * @remarks
 *   A ribbon is lit while the readout is at the ribbon or at the arc of one of its nodes, and
 *   dimmed while it is at any other mark. An arc is dimmed while the readout is at any other mark.
 * @param mark - The mark painted.
 * @param active - The mark the readout is at, if any.
 */
export function traceOf(mark: Mark, active?: Mark): Trace {
  if (active === undefined) return undefined;

  if (mark.kind === "arc") return active === mark ? undefined : "dimmed";

  const { source, target } = mark.ribbon;
  const touched = active.kind === "arc" && [source.key, target.key].includes(active.group.key);

  return active === mark || touched ? "lit" : "dimmed";
}
