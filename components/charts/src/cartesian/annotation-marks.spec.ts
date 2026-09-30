import { type ReactElement } from "react";

import { ReferenceArea, ReferenceDot, ReferenceLine } from "recharts";
import { describe, expect, it } from "vitest";

import { AnnotationLabel } from "#cartesian/annotation-label.tsx";
import { annotationMarksOf } from "#cartesian/annotation-marks.tsx";
import { type Annotation } from "#cartesian/annotations.ts";

/**
 * Lists a moment, a period and a point.
 */
const NOTES: Annotation[] = [
  { at: "tue", key: "deploy", label: "Deploy 4.12" },
  { at: "thu", color: "info", key: "freeze", label: "Freeze", until: "sat" },
  { at: "fri", color: "error", key: "spike", label: "Error spike", value: 105 },
];

/**
 * Returns the mark of each annotation on an upright chart, or on a chart of bars on their side.
 */
function marksOf(upright = true): ReactElement[] {
  return annotationMarksOf({ annotations: NOTES, upright });
}

/**
 * Returns true when a value is a function recharts calls with a mark's box.
 */
function isWriter(value: unknown): value is (box: object) => unknown {
  return typeof value === "function";
}

/**
 * Returns the words a mark's label writer returns for a box 40px wide at 100 across and 20 down.
 */
function labelOf(mark: ReactElement | undefined): unknown {
  const props: unknown = mark?.props;
  const write: unknown =
    typeof props === "object" && props !== null && "label" in props ? props.label : undefined;

  return isWriter(write) ? write({ viewBox: { width: 40, x: 100, y: 20 } }) : undefined;
}

describe("annotation-marks", () => {
  it("returns a mark per annotation in the order of the annotations", () => {
    expect(marksOf().map((mark) => mark.type)).toStrictEqual([
      ReferenceLine,
      ReferenceArea,
      ReferenceDot,
    ]);
  });

  it("dashes a moment's rule across the plot at its category", () => {
    const [rule] = marksOf();

    expect(rule?.props).toMatchObject({
      className: "chart-annotation",
      ifOverflow: "hidden",
      stroke: "var(--colors-neutral-chart)",
      strokeDasharray: "4 3",
      x: "tue",
    });
  });

  it("washes a period from its start to its end at 0.12 without an edge", () => {
    const [, wash] = marksOf();

    expect(wash?.props).toMatchObject({
      fill: "var(--colors-info-chart)",
      fillOpacity: 0.12,
      stroke: "none",
      x1: "thu",
      x2: "sat",
    });
  });

  it("rings a point 5px wide in a 2px stroke without a fill", () => {
    const [, , ring] = marksOf();

    expect(ring?.props).toMatchObject({
      fill: "none",
      ifOverflow: "extendDomain",
      r: 5,
      stroke: "var(--colors-error-chart)",
      strokeWidth: 2,
      x: "fri",
      y: 105,
    });
  });

  it.each([
    { index: 0, kind: "rule", want: { y: "tue" } },
    { index: 1, kind: "wash", want: { y1: "thu", y2: "sat" } },
    { index: 2, kind: "ring", want: { x: 105, y: "fri" } },
  ])(
    "places the $kind along the category axis down a chart of bars on their side",
    ({ index, want }) => {
      expect(marksOf(false)[index]?.props).toMatchObject(want);
    },
  );

  it("writes an annotation's words at its mark's box in its place in the list", () => {
    expect(labelOf(marksOf()[1])).toMatchObject({
      props: { order: 1, point: false, value: "Freeze", width: 40, x: 100, y: 20 },
      type: AnnotationLabel,
    });
  });

  it("writes a point's words above its ring", () => {
    expect(labelOf(marksOf()[2])).toMatchObject({ props: { point: true } });
  });

  it("writes a period's words at the top of its wash when it states a value too", () => {
    const [wash] = annotationMarksOf({
      annotations: [{ at: "thu", key: "freeze", label: "Freeze", until: "sat", value: 3 }],
      upright: true,
    });

    expect(labelOf(wash)).toMatchObject({ props: { point: false } });
  });
});
