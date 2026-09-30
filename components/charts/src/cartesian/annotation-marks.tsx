/**
 * Renders a cartesian chart's annotations: a dashed rule across the plot at a moment, a wash over a
 * period, and a ring around a point, each in its palette's chart color with its words.
 *
 * @remarks
 *   A rule is dashed, a wash fills at 0.12 with no edge, and a ring is 2px with no fill, so the
 *   series' own point shows through it. recharts renders a wash under the series and a ring over
 *   them. The marks run along the category axis, so on a chart of bars on their side a rule runs
 *   across the plot's height. A ring extends the value axis to its value.
 */

import { type ReactElement } from "react";

import { ReferenceArea, ReferenceDot, ReferenceLine } from "recharts";

import { AnnotationLabel } from "#cartesian/annotation-label.tsx";
import { type Annotation } from "#cartesian/annotations.ts";
import { colorOf } from "#chart/colors.ts";
import { ANNOTATION } from "#chart/placed.ts";

/**
 * Dash pattern of a moment's rule: 4px dashes, 3px apart.
 */
const DASH = "4 3";

/**
 * Fill opacity of a period's wash.
 */
const WASH = 0.12;

/**
 * Radius of a point's ring, in pixels.
 */
const RING = 5;

/**
 * Width of a point's ring, in pixels.
 */
const RING_WIDTH = 2;

/**
 * Describes the box recharts gives a reference mark's label: the mark's own box in pixels.
 */
interface LabelBox {
  /**
   * Box of the mark.
   */
  readonly viewBox: {
    /**
     * Width of the mark's box.
     */
    readonly width: number;

    /**
     * Left edge of the mark's box.
     */
    readonly x: number;

    /**
     * Top edge of the mark's box.
     */
    readonly y: number;
  };
}

/**
 * Describes what a chart's annotations are rendered from.
 */
export interface AnnotationMarksOptions {
  /**
   * Annotations of the chart, in order.
   */
  readonly annotations: readonly Annotation[];

  /**
   * Whether the category axis runs along the plot's bottom edge, as it does unless bars lie on
   * their side.
   */
  readonly upright: boolean;
}

/**
 * Returns the writer of an annotation's words, which recharts calls with the mark's box.
 *
 * @param annotation - The mark's fields: its category, its period's end or its value, and its
 *   words.
 * @param order - The annotation's place in the chart's list.
 */
function labelOf(annotation: Annotation, order: number): (box: LabelBox) => ReactElement {
  const point = annotation.until === undefined && annotation.value !== undefined;

  /**
   * Returns the annotation's words at the mark's box.
   */
  return function label({ viewBox }) {
    return (
      <AnnotationLabel
        order={order}
        point={point}
        value={annotation.label}
        width={viewBox.width}
        x={viewBox.x}
        y={viewBox.y}
      />
    );
  };
}

/**
 * Returns a mark per annotation, in the order of the annotations.
 *
 * @param options - The annotations and the direction of the category axis.
 */
export function annotationMarksOf({
  annotations,
  upright,
}: AnnotationMarksOptions): ReactElement[] {
  return annotations.map((annotation, order) => {
    const { at, key, until, value } = annotation;
    const color = colorOf(annotation.color ?? "neutral");
    const label = labelOf(annotation, order);

    if (until !== undefined) {
      const span = upright ? { x1: at, x2: until } : { y1: at, y2: until };

      return (
        <ReferenceArea
          className={ANNOTATION}
          fill={color}
          fillOpacity={WASH}
          ifOverflow="hidden"
          key={key}
          label={label}
          stroke="none"
          {...span}
        />
      );
    }

    if (value !== undefined) {
      const place = upright ? { x: at, y: value } : { x: value, y: at };

      return (
        <ReferenceDot
          className={ANNOTATION}
          fill="none"
          ifOverflow="extendDomain"
          key={key}
          label={label}
          r={RING}
          stroke={color}
          strokeWidth={RING_WIDTH}
          {...place}
        />
      );
    }

    return (
      <ReferenceLine
        className={ANNOTATION}
        ifOverflow="hidden"
        key={key}
        label={label}
        stroke={color}
        strokeDasharray={DASH}
        {...(upright ? { x: at } : { y: at })}
      />
    );
  });
}
