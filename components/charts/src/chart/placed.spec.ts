import { describe, expect, it } from "vitest";

import {
  ANNOTATION,
  ANNOTATION_LABEL,
  CROSSHAIR,
  DIVISION,
  MARKER,
  MARKER_FILL,
  PLACED,
  POINT_LABEL,
  QUADRANT,
  ROWS,
  ROWS_TALL,
} from "#chart/placed.ts";

describe("placed", () => {
  it("names the classes of a quadrant chart's parts", () => {
    expect([DIVISION, QUADRANT, POINT_LABEL]).toStrictEqual([
      "chart-division",
      "chart-quadrant",
      "chart-point-label",
    ]);
  });

  it("names the class of a timeline's marker", () => {
    expect(MARKER).toBe("chart-marker");
  });

  it("names the custom property of a marker's color", () => {
    expect(MARKER_FILL).toBe("--chart-marker");
  });

  it("names the custom property of a plot's rows", () => {
    expect(ROWS).toBe("--chart-rows");
  });

  it("sets the dividing lines in the emphasized border ink", () => {
    expect(PLACED).toMatchObject({
      [`& .${DIVISION} .recharts-reference-line-line`]: { stroke: "border.emphasized" },
    });
  });

  it("sets the dividing lines in CanvasText under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .${DIVISION} .recharts-reference-line-line`]: { _highContrast: { stroke: "CanvasText" } },
    });
  });

  it("sets the quadrants' names in the muted ink at the xs body style", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${QUADRANT}`]: {
        fill: "fg.muted",
        fontWeight: "medium",
        pointerEvents: "none",
        textStyle: "body.xs",
      },
    });
  });

  it("sets the quadrants' names in CanvasText under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${QUADRANT}`]: { _highContrast: { fill: "CanvasText" } },
    });
  });

  it("sets a point's words in the ink inside a halo in the panel's color", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${POINT_LABEL}`]: {
        fill: "fg",
        paintOrder: "stroke",
        stroke: "bg.panel",
        strokeWidth: "ring",
        textStyle: "body.xs",
      },
    });
  });

  it("lets the pointer through a point's words to the point", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${POINT_LABEL}`]: { pointerEvents: "none" },
    });
  });

  it("sets a point's words in CanvasText inside Canvas under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${POINT_LABEL}`]: {
        _highContrast: { fill: "CanvasText", stroke: "Canvas" },
      },
    });
  });

  it("fills a marker's dot or pill from its color inside an edge in the panel's color", () => {
    expect(PLACED).toMatchObject({
      [`& .${MARKER} > :is(circle, rect)`]: {
        fill: "var(--chart-marker)",
        stroke: "bg.panel",
        strokeWidth: "ring",
      },
    });
  });

  it("edges a marker in Canvas under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .${MARKER} > :is(circle, rect)`]: { _highContrast: { stroke: "Canvas" } },
    });
  });

  it("shows the button cursor over a marker a press selects", () => {
    expect(PLACED).toMatchObject({ [`& .${MARKER}[data-press]`]: { cursor: "button" } });
  });

  it("writes a marker's count in the ink that contrasts with the marker's color", () => {
    expect(PLACED).toMatchObject({
      [`& .${MARKER} > text`]: {
        fill: "contrast-color(var(--chart-marker))",
        pointerEvents: "none",
      },
    });
  });

  it("names the classes of an annotation's mark and words", () => {
    expect([ANNOTATION, ANNOTATION_LABEL]).toStrictEqual([
      "chart-annotation",
      "chart-annotation-label",
    ]);
  });

  it("names the class of the crosshair", () => {
    expect(CROSSHAIR).toBe("chart-crosshair");
  });

  it("sets an annotation's words in the label ink inside a halo in the panel's color", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${ANNOTATION_LABEL}`]: {
        fill: "fg.muted",
        paintOrder: "stroke",
        pointerEvents: "none",
        stroke: "bg.panel",
        strokeLinejoin: "round",
        strokeWidth: "ring",
        textStyle: "body.xs",
      },
    });
  });

  it("sets an annotation's words in CanvasText inside Canvas under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .recharts-text.${ANNOTATION_LABEL}`]: {
        _highContrast: { fill: "CanvasText", stroke: "Canvas" },
      },
    });
  });

  it("sets the crosshair in the cursor's border ink", () => {
    expect(PLACED).toMatchObject({
      [`& .${CROSSHAIR} .recharts-reference-line-line`]: { stroke: "border" },
    });
  });

  it("sets the crosshair in CanvasText under forced colors", () => {
    expect(PLACED).toMatchObject({
      [`& .${CROSSHAIR} .recharts-reference-line-line`]: {
        _highContrast: { stroke: "CanvasText" },
      },
    });
  });

  it("sizes a plot at sizes.10 per row plus sizes.12 for the axis", () => {
    expect(ROWS_TALL).toStrictEqual({
      aspectRatio: "auto",
      blockSize: "calc(var(--chart-rows, 1) * {sizes.10} + {sizes.12})",
    });
  });
});
