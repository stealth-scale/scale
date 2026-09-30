import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { StepsTable, type StepsTableProps } from "#funnel-chart/steps-table.tsx";
import { type FunnelStage, funnelSteps } from "#funnel-chart/steps.ts";

/**
 * Lists three stages of a checkout, the last without a label.
 */
const STAGES: readonly FunnelStage[] = [
  { key: "visited", label: "Visited", value: 1000 },
  { key: "basket", label: "Basket", value: 400 },
  { key: "paid", value: 40 },
];

/**
 * Headings of the columns.
 */
const WORDS = {
  name: "Conversion by stage",
  overall: "Of first",
  stage: "Stage",
  step: "Of previous",
  value: "Count",
};

/**
 * Renders the table of the stages' steps inside a chart, each stage filled with a color of its
 * own, and returns the container.
 */
function drawn(props: Partial<StepsTableProps> = {}): HTMLElement {
  const fills = ["red", "green", "blue"];
  const lines = funnelSteps(STAGES).map((step, at) => ({ fill: fills[at] ?? "", step }));

  return render(
    charted({
      children: (
        <StepsTable
          formatRate={(value) => `${String(Math.round(Number(value) * 100))} pct`}
          formatValue={(value) => `${String(value)} n`}
          lines={lines}
          words={WORDS}
          {...props}
        />
      ),
    }),
  ).container;
}

/**
 * Returns the text of every cell of a column in the body, a row header's too.
 */
function columnOf(container: Element, at: number): string[] {
  return [...container.querySelectorAll("tbody tr")].map(
    (row) => row.children[at]?.textContent ?? "",
  );
}

describe("StepsTable", () => {
  it("renders a row per step", () => {
    expect(drawn().querySelectorAll("tbody tr")).toHaveLength(3);
  });

  it("heads the columns with the words", () => {
    expect(
      [...drawn().querySelectorAll("thead th")].map((heading) => heading.textContent),
    ).toStrictEqual(["Stage", "Count", "Of previous", "Of first"]);
  });

  it("renders each stage's name as a row header", () => {
    expect(
      [...drawn().querySelectorAll("tbody th")].map((heading) => heading.textContent),
    ).toStrictEqual(["Visited", "Basket", "paid"]);
  });

  it("renders a swatch of the stage's fill before its name", () => {
    expect(
      [...drawn().querySelectorAll<HTMLElement>("tbody th .color-swatch")].map(
        (swatch) => swatch.dataset["value"],
      ),
    ).toStrictEqual(["red", "green", "blue"]);
  });

  it("hides the swatch from assistive technology", () => {
    expect(drawn().querySelector("tbody th .color-swatch")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("lines the swatch up with the name in the chart's row class", () => {
    expect(drawn().querySelector("tbody th > span")?.classList.contains("chart__row")).toBe(true);
  });

  it("writes each stage's count with formatValue", () => {
    expect(columnOf(drawn(), 1)).toStrictEqual(["1000 n", "400 n", "40 n"]);
  });

  it("writes each stage's share of the stage before with formatRate", () => {
    expect(columnOf(drawn(), 2)).toStrictEqual(["", "40 pct", "10 pct"]);
  });

  it("writes each stage's share of the first stage with formatRate", () => {
    expect(columnOf(drawn(), 3)).toStrictEqual(["100 pct", "40 pct", "4 pct"]);
  });

  it("aligns the counts and the rates as figures", () => {
    expect(
      [...drawn().querySelectorAll<HTMLElement>("tbody tr:first-child td")].map(
        (cell) => cell.dataset["numeric"],
      ),
    ).toStrictEqual(["true", "true", "true"]);
  });

  it("names the table's scroll area by the words' name", () => {
    expect(drawn().querySelector(".table__viewport")?.getAttribute("aria-label")).toBe(
      "Conversion by stage",
    );
  });

  it("renders the table at the small size", () => {
    expect(drawn().querySelector("table")?.classList.contains("table__root--sm")).toBe(true);
  });
});
