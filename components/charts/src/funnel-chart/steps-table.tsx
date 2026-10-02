/**
 * Renders a funnel's steps as a table: each stage with its count, its share of the stage before and
 * its share of the first stage.
 *
 * @remarks
 *   The table is the collections package's `Table.Simple` at the small size, so it scrolls sideways
 *   in a room too narrow for it, and its scroll area is then a region in the tab order, named by
 *   the words' `name`. A heading names each rate, because two percentages side by side read as one
 *   another without one. The first stage has no stage before it, so its first rate is empty. Each
 *   stage's name follows a swatch of its fill, the data package's `ColorSwatch`.
 */

import { type ReactElement } from "react";

import { Table } from "@stealthscale/component-collections";
import { ColorSwatch } from "@stealthscale/component-data";

import { withContext } from "#chart/context.ts";
import { type FunnelStep } from "#funnel-chart/steps.ts";

/**
 * Renders the `span` that lines a stage's swatch up with its name, in the chart's row class.
 */
const Stage = withContext("span", "row");

/**
 * Describes the words of the table: its accessible name and the headings of its columns.
 */
export interface StepsWords {
  /**
   * Accessible name of the table's scroll area, which a screen reader announces while the table
   * scrolls sideways.
   */
  readonly name: string;

  /**
   * Heading of each stage's share of the first stage.
   */
  readonly overall: string;

  /**
   * Heading of the stages' names.
   */
  readonly stage: string;

  /**
   * Heading of each stage's share of the stage before.
   */
  readonly step: string;

  /**
   * Heading of the counts.
   */
  readonly value: string;
}

/**
 * Describes one line of the table: a step and the CSS value of its stage's fill.
 */
export interface StepLine {
  /**
   * CSS value of the stage's fill.
   */
  readonly fill: string;

  /**
   * Step the line describes.
   */
  readonly step: FunnelStep;
}

/**
 * Describes the props of the table: the lines, the headings and the writers of a count and a rate.
 */
export interface StepsTableProps {
  /**
   * Writes a rate, such as 41%.
   */
  readonly formatRate: (value: unknown) => string;

  /**
   * Writes a count, such as 12,900.
   */
  readonly formatValue: (value: unknown) => string;

  /**
   * Lines from the top of the funnel.
   */
  readonly lines: readonly StepLine[];

  /**
   * Headings of the columns.
   */
  readonly words: StepsWords;
}

/**
 * Returns a line's stage: a swatch of its fill beside its name, the key without a name.
 */
function stageOf(line: StepLine): ReactElement {
  return (
    <Stage>
      <ColorSwatch aria-hidden size="xs" value={line.fill} />
      {line.step.stage.label ?? line.step.stage.key}
    </Stage>
  );
}

/**
 * Returns the React key of a line: its stage's key.
 */
function keyOf(line: StepLine): string {
  return line.step.stage.key;
}

/**
 * Returns the table's columns: the stage as a row header, then the count and the two rates.
 *
 * @param props - The headings and the writers of a count and a rate.
 */
function columnsOf({
  formatRate,
  formatValue,
  words,
}: Omit<StepsTableProps, "lines">): Array<Table.ColumnOf<StepLine>> {
  return [
    { cell: stageOf, key: "stage", label: words.stage, rowHeader: true },
    {
      cell: (line) => formatValue(line.step.value),
      key: "value",
      label: words.value,
      numeric: true,
    },
    {
      cell: (line) => (line.step.conversion === null ? null : formatRate(line.step.conversion)),
      key: "step",
      label: words.step,
      numeric: true,
    },
    {
      cell: (line) => formatRate(line.step.overall),
      key: "overall",
      label: words.overall,
      numeric: true,
    },
  ];
}

/**
 * Renders the table of the funnel's steps.
 *
 * @param props - The lines, the headings and the writers of a count and a rate.
 */
export function StepsTable({ lines, ...writers }: StepsTableProps): ReactElement {
  return (
    <Table.Simple
      aria-label={writers.words.name}
      columns={columnsOf(writers)}
      rows={lines}
      rowToKey={keyOf}
      size="sm"
    />
  );
}
