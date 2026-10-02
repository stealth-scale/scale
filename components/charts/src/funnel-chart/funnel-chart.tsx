/**
 * Renders a funnel chart: the stages one set passes through, each a trapezoid as wide as its count,
 * above a table of each stage's count and both of its rates.
 *
 * @remarks
 *   The stages run from the top in their order, each narrowing to the next, and the last is a
 *   rectangle. A trapezoid is read by its width, which no one reads to three digits, so each
 *   stage's count is written on it, and the table under the plot writes the counts and both rates:
 *   the share of the stage before and the share of the first stage. The stages take one palette,
 *   from the whole color at the top to 35% of it over the panel at the bottom, because the stages
 *   are ordered. The tooltip heads a stage with its name and writes its count and rates, and the
 *   arrows walk the stages. The chart has no legend, because hiding a stage would change both rates
 *   of the stage after it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Funnel, FunnelChart as FunnelPlot, LabelList, Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { SHARE } from "#chart/recipe.ts";
import { type RootProps } from "#chart/root.tsx";
import { type StepLine, StepsTable, type StepsWords } from "#funnel-chart/steps-table.tsx";
import { type FunnelStage, type FunnelStep, funnelSteps } from "#funnel-chart/steps.ts";

/**
 * Message the chart renders without stages unless it states one.
 */
const EMPTY = "No data";

/**
 * Palette the stages take unless stated: the theme's first series color.
 */
const FIRST: Chart.ChartColor = "series.1";

/**
 * Share of the palette's color, in percent, the last stage takes over the panel.
 */
const LIGHTEST = 35;

/**
 * Options a rate is written with: two significant digits, so a 0.3% conversion is not written as
 * 0%.
 */
const RATES: Intl.NumberFormatOptions = { maximumSignificantDigits: 2, style: "percent" };

/**
 * Name of the table and headings of its columns and the tooltip's rows unless stated.
 */
const WORDS: StepsWords = {
  name: "Conversion by stage",
  overall: "Of first",
  stage: "Stage",
  step: "Of previous",
  value: "Count",
};

/**
 * Describes the props of a funnel chart: the stages, the words, the switches and the figure's
 * props.
 */
export interface FunnelChartProps extends Omit<RootProps, "chart" | "children" | "color"> {
  /**
   * Whether the stages grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the stages.
   */
  readonly children?: ReactNode;

  /**
   * Palette the stages take their color from. The theme's first series color unless stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Index of the stage the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no stages.
   */
  readonly empty?: ReactNode;

  /**
   * Accessible name of the chart's keyboard layer, such as "Checkout funnel".
   */
  readonly label: string;

  /**
   * Locale the counts and the rates are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Heading of each stage's share of the first stage, in the table and the tooltip. "Of first"
   * unless stated.
   */
  readonly overallLabel?: string | undefined;

  /**
   * Heading of the stages' names in the table. "Stage" unless stated.
   */
  readonly stageLabel?: string | undefined;

  /**
   * Stages from the top of the funnel, each a subset of the one before it.
   */
  readonly stages: readonly FunnelStage[];

  /**
   * Heading of each stage's share of the stage before, in the table and the tooltip. "Of
   * previous" unless stated.
   */
  readonly stepLabel?: string | undefined;

  /**
   * Whether the table of each stage's count and rates renders under the plot.
   */
  readonly steps?: boolean | undefined;

  /**
   * Accessible name of the table's scroll area, which a screen reader announces while the table
   * scrolls sideways. "Conversion by stage" unless stated.
   */
  readonly stepsLabel?: string | undefined;

  /**
   * Heading of the counts in the table and the tooltip. "Count" unless stated.
   */
  readonly valueLabel?: string | undefined;

  /**
   * `Intl.NumberFormat` options the counts are written with, on the stages, in the table and in
   * the tooltip.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether each stage's count is written on it.
   */
  readonly values?: boolean | undefined;
}

/**
 * Describes one row recharts plots: the stage's fill, its key as recharts' name, and its count.
 *
 * @remarks
 *   Recharts spreads each row into its trapezoid's props, so a row has no field named after the
 *   trapezoid's geometry.
 */
interface Row {
  /**
   * CSS value of the stage's fill.
   */
  readonly fill: string;

  /**
   * Key of the stage, which recharts reports to the tooltip as the entry's name.
   */
  readonly name: string;

  /**
   * Count at the stage.
   */
  readonly value: number;
}

/**
 * Describes what the recharts funnel is built from.
 */
interface PlotOptions {
  /**
   * Whether the stages grow in.
   */
  readonly animate: boolean;

  /**
   * Recharts elements rendered after the stages.
   */
  readonly children: ReactNode;

  /**
   * Index of the stage the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Writes a rate.
   */
  readonly formatRate: (value: unknown) => string;

  /**
   * Writes a count.
   */
  readonly formatValue: (value: unknown) => string;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Lines of the stages, from the top of the funnel.
   */
  readonly lines: readonly StepLine[];

  /**
   * Rows recharts plots, the chart's data.
   */
  readonly rows: Row[];

  /**
   * Whether each stage's count is written on it.
   */
  readonly values: boolean;

  /**
   * Headings of the tooltip's rows.
   */
  readonly words: StepsWords;
}

/**
 * Returns the CSS value of a stage's fill: the palette's color mixed over the panel, from the
 * whole color at the top to 35% of it at the bottom.
 *
 * @param color - The CSS value of the palette's chart color.
 * @param at - The stage's place from the top.
 * @param count - The number of stages.
 */
function fillOf(color: string, at: number, count: number): string {
  const share = count < 2 ? 100 : LIGHTEST + ((100 - LIGHTEST) * (count - 1 - at)) / (count - 1);

  return `color-mix(in oklab, ${color} ${String(Math.round(share))}%, var(--colors-bg-panel))`;
}

/**
 * Returns the row recharts plots for a line.
 */
function rowOf(line: StepLine): Row {
  return { fill: line.fill, name: line.step.stage.key, value: line.step.value };
}

/**
 * Returns the step of the stage the tooltip's entries were read from.
 */
function stepOf(
  lines: readonly StepLine[],
  entries: readonly Chart.TooltipEntry[],
): FunnelStep | undefined {
  const key = entries[0]?.name;

  return lines.find((line) => line.step.stage.key === key)?.step;
}

/**
 * Returns the tooltip's rows for a step: its count, its share of the stage before and its share of
 * the first stage, or no row without a step.
 *
 * @param step - The step the tooltip is for.
 * @param options - The writers and the rows' names.
 */
function factsOf(
  step: FunnelStep | undefined,
  options: Pick<PlotOptions, "formatRate" | "formatValue" | "words">,
): Chart.TooltipRow[] {
  if (step === undefined) return [];

  const { formatRate, formatValue, words } = options;
  const before =
    step.conversion === null
      ? []
      : [{ key: "step", name: words.step, value: formatRate(step.conversion) }];

  return [
    { key: "value", name: words.value, value: formatValue(step.value) },
    ...before,
    { key: "overall", name: words.overall, value: formatRate(step.overall) },
  ];
}

/**
 * Returns recharts' funnel chart of the stages, with the tooltip, the counts on the stages and the
 * caller's children.
 *
 * @param options - The lines, the writers, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { defaultIndex, lines, rows } = options;

  /**
   * Returns the name of the stage the tooltip is for.
   */
  const headingOf = (entries: readonly Chart.TooltipEntry[]): ReactNode => {
    const stage = stepOf(lines, entries)?.stage;

    return stage?.label ?? stage?.key;
  };

  return (
    <FunnelPlot accessibilityLayer data={rows} title={options.label}>
      <Tooltip
        content={
          <Chart.Tooltip
            headingOf={headingOf}
            rowsOf={(entries) => factsOf(stepOf(lines, entries), options)}
          />
        }
        {...omitUndefined({ defaultIndex })}
      />
      <Funnel
        data={rows}
        dataKey="value"
        isAnimationActive={options.animate ? "auto" : false}
        lastShapeType="rectangle"
        nameKey="name"
      >
        {options.values ? (
          <LabelList
            className={SHARE}
            dataKey="value"
            formatter={options.formatValue}
            position="center"
          />
        ) : null}
      </Funnel>
      {options.children}
    </FunnelPlot>
  );
}

/**
 * Returns the table's name and the headings of its columns and the tooltip's rows, the English
 * ones unless stated.
 *
 * @param props - The words the caller states.
 */
function wordsOf({
  overallLabel = WORDS.overall,
  stageLabel = WORDS.stage,
  stepLabel = WORDS.step,
  stepsLabel = WORDS.name,
  valueLabel = WORDS.value,
}: Pick<
  FunnelChartProps,
  "overallLabel" | "stageLabel" | "stepLabel" | "stepsLabel" | "valueLabel"
>): StepsWords {
  return {
    name: stepsLabel,
    overall: overallLabel,
    stage: stageLabel,
    step: stepLabel,
    value: valueLabel,
  };
}

/**
 * Splits the props into the plot's switches and the figure's props.
 *
 * @param props - The chart's props past the stages, the words and the table.
 */
function split({
  animate = false,
  children,
  color = FIRST,
  defaultIndex,
  label,
  values = true,
  ...root
}: Omit<
  FunnelChartProps,
  | "caption"
  | "empty"
  | "locale"
  | "overallLabel"
  | "stageLabel"
  | "stages"
  | "stepLabel"
  | "steps"
  | "stepsLabel"
  | "valueLabel"
  | "valueOptions"
>): [
  Pick<PlotOptions, "animate" | "children" | "defaultIndex" | "label" | "values">,
  Chart.ChartColor,
  Omit<RootProps, "chart" | "children">,
] {
  return [{ animate, children, defaultIndex, label, values }, color, root];
}

/**
 * Renders the chart's figure around the funnel, the table of its steps and the caption.
 *
 * @param props - The stages, the words, the switches and the figure's props.
 */
export function FunnelChart({
  caption,
  empty = EMPTY,
  locale,
  overallLabel,
  ratio = "video",
  stageLabel,
  stages,
  stepLabel,
  steps = true,
  stepsLabel,
  valueLabel,
  valueOptions,
  ...rest
}: FunnelChartProps): ReactElement {
  const [plot, color, root] = split(rest);
  const words = wordsOf({ overallLabel, stageLabel, stepLabel, stepsLabel, valueLabel });
  const flow = funnelSteps(stages);
  const base = Chart.colorOf(color);
  const lines = flow.map((step, at) => ({ fill: fillOf(base, at, flow.length), step }));
  const rows = lines.map((line) => rowOf(line));
  const chart = Chart.useChart({ data: rows, locale, series: [] });
  const writers = {
    formatRate: chart.formatNumber(RATES),
    formatValue: chart.formatNumber(valueOptions),
  };

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot>{plotOf({ ...plot, ...writers, lines, rows, words })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {steps && lines.length > 0 ? <StepsTable {...writers} lines={lines} words={words} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
