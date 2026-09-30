/**
 * Writes an annotation's words: inside the top of a moment's rule or a period's wash, or above a
 * point's ring.
 *
 * @remarks
 *   The words start 4px inside the mark's box and hang from its top, or centre 4px above a ring,
 *   centred on it, in the recipe's label ink inside a halo in the panel's color. They take no
 *   pointer events. Words that leave the plot, or meet the words of an annotation earlier in the
 *   list, are hidden, and the tooltip still names the annotation at its category.
 */

import { type ReactElement, useRef } from "react";

import { Text } from "recharts";

import { useCleared } from "#chart/cleared.ts";
import { ANNOTATION_LABEL } from "#chart/placed.ts";
import { NODE } from "#chart/recipe.ts";

/**
 * Space between the words and the edge of the mark's box, in pixels.
 */
const INSET = 4;

/**
 * Describes the props of an annotation's words: the mark's box, the annotation's place and words.
 */
export interface AnnotationLabelProps {
  /**
   * Place of the annotation in the chart's list, which decides whose words two meeting
   * annotations keep.
   */
  readonly order: number;

  /**
   * Whether the mark is a point's ring, whose words are written above it.
   */
  readonly point: boolean;

  /**
   * Words of the annotation.
   */
  readonly value: string;

  /**
   * Width of the mark's box in pixels: a period's width, a ring's diameter, or 0 for a rule.
   */
  readonly width: number;

  /**
   * Left edge of the mark's box in pixels.
   */
  readonly x: number;

  /**
   * Top edge of the mark's box in pixels.
   */
  readonly y: number;
}

/**
 * Renders the annotation's words in a group the word check measures.
 *
 * @param props - The mark's box, the annotation's place and its words.
 */
export function AnnotationLabel({
  order,
  point,
  value,
  width,
  x,
  y,
}: AnnotationLabelProps): ReactElement {
  const group = useRef<SVGGElement>(null);

  useCleared(group, [x, y, value].join("\n"));

  return (
    <g className={NODE} data-walk={order} ref={group}>
      <Text
        className={ANNOTATION_LABEL}
        textAnchor={point ? "middle" : "start"}
        verticalAnchor={point ? "end" : "start"}
        x={point ? x + width / 2 : x + INSET}
        y={point ? y - INSET : y + INSET}
      >
        {value}
      </Text>
    </g>
  );
}
