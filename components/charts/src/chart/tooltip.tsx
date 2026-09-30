/**
 * Renders the content of recharts' tooltip: the category under the pointer or the key focus, and
 * each shown series' swatch, name and value.
 *
 * @remarks
 *   Recharts renders the part as its `Tooltip`'s `content`, with `active`, `label`, `payload` and
 *   `accessibilityLayer`, and keeps it mounted while the tooltip is inactive. The panel is an
 *   `output` with no rows while inactive, so the live region exists before the first point fills
 *   it. It is `aria-live="assertive"` while the keyboard layer is on, as recharts' own content is.
 *   A series the legend hides has no row. The rows follow the legend's order, whatever order the
 *   marks stack in. Each row's swatch is the data package's `ColorSwatch`. The heading renders only
 *   with text, because a pie's tooltip names no category. A tooltip about one point, such as a
 *   scatter's, takes its heading from `headingOf` and its rows' names from `nameOf`. A tooltip
 *   about one datum with several numbers, such as a box, takes its rows from `rowsOf`. Notes about
 *   the category, such as the annotations at it, follow the rows with a swatch each and no value.
 */

import { type ReactElement, type ReactNode } from "react";

import { ColorSwatch } from "@stealthscale/component-data";

import { withContext } from "#chart/context.ts";
import { type ChartApi, type Series, useChartContext } from "#chart/use-chart.ts";

/**
 * Renders the `output` with the chart's tooltip class.
 */
const Panel = withContext("output", "tooltip");

/**
 * Renders the `span` with the category.
 */
const Heading = withContext("span", "heading");

/**
 * Renders the `span` of one series.
 */
const Row = withContext("span", "row");

/**
 * Renders the `span` with a series' name.
 */
const Name = withContext("span", "name");

/**
 * Renders the `span` with a series' value.
 */
const Value = withContext("span", "value");

/**
 * Describes one value recharts passes for a series.
 */
export interface TooltipEntry {
  /**
   * Field the series reads, which is the series' key on a cartesian chart.
   */
  readonly dataKey?: unknown;

  /**
   * Name of the entry, which is the series' key for a pie's sector and a band.
   */
  readonly name?: unknown;

  /**
   * Row the entry was read from.
   */
  readonly payload?: unknown;

  /**
   * Value of the series at the category, or a band's two ends.
   */
  readonly value?: unknown;
}

/**
 * Describes the props of the tooltip: the formatters the caller passes, and what recharts passes.
 */
export interface TooltipProps {
  /**
   * Whether recharts' keyboard layer is on, which makes the panel assertive. Recharts passes it.
   */
  readonly accessibilityLayer?: boolean | undefined;

  /**
   * Whether recharts shows the tooltip. Recharts passes it.
   */
  readonly active?: boolean | undefined;

  /**
   * Returns the CSS color of an entry's swatch, for a mark whose color changes from row to row.
   * The series' color unless stated.
   */
  readonly entryColor?: ((entry: TooltipEntry) => string) | undefined;

  /**
   * Writes the category, such as a day. The category's own text unless stated.
   */
  readonly formatLabel?: ((value: unknown) => string) | undefined;

  /**
   * Writes each series' value, such as an amount in a currency, given the value and its entry. A
   * number in the chart's locale unless stated, and a band's two ends as a range.
   */
  readonly formatValue?: ((value: unknown, entry: TooltipEntry) => string) | undefined;

  /**
   * Returns the heading from the entries shown, for a tooltip about one point rather than one
   * category, such as a scatter's. The category, written by `formatLabel`, unless stated.
   */
  readonly headingOf?: ((entries: readonly TooltipEntry[]) => ReactNode) | undefined;

  /**
   * Category the tooltip is for. Recharts passes it.
   */
  readonly label?: unknown;

  /**
   * Returns a row's name, such as the title of the axis a scatter's value is on. The series' label
   * unless stated.
   */
  readonly nameOf?: ((entry: TooltipEntry) => ReactNode) | undefined;

  /**
   * Returns the notes about the category, such as the annotations at it, which render after the
   * rows. None unless stated.
   */
  readonly notesOf?: ((label: unknown) => readonly TooltipNote[]) | undefined;

  /**
   * Values at the category, one per series. Recharts passes them.
   */
  readonly payload?: readonly TooltipEntry[] | undefined;

  /**
   * Returns the rows of a tooltip about one datum with several numbers, such as a box's median and
   * quartiles, from the entries shown. The rows render without a swatch. A row per shown series
   * unless stated.
   */
  readonly rowsOf?: ((entries: readonly TooltipEntry[]) => readonly TooltipRow[]) | undefined;
}

/**
 * Describes a note about a category: its words and the color of its swatch.
 */
export interface TooltipNote {
  /**
   * CSS value of the note's swatch.
   */
  readonly color: string;

  /**
   * Key of the note among the tooltip's rows.
   */
  readonly key: string;

  /**
   * Words of the note, such as "Deploy 4.12".
   */
  readonly text: ReactNode;
}

/**
 * Describes a row of a tooltip about one datum: a name and the value the caller wrote.
 */
export interface TooltipRow {
  /**
   * Key of the row among the tooltip's rows.
   */
  readonly key: string;

  /**
   * Name of the number, such as "Median".
   */
  readonly name: ReactNode;

  /**
   * Number as the caller wrote it, such as "62ms".
   */
  readonly value: ReactNode;
}

/**
 * Describes what a row per shown series is written with: its key, its swatch's color, its name and
 * its value.
 */
interface Writers {
  /**
   * Returns the CSS value of an entry's swatch.
   */
  readonly colored: (entry: TooltipEntry) => string;

  /**
   * Returns the key of an entry's series.
   */
  readonly keyed: (entry: TooltipEntry) => string;

  /**
   * Returns an entry's name.
   */
  readonly named: (entry: TooltipEntry) => ReactNode;

  /**
   * Writes an entry's value.
   */
  readonly valued: (value: unknown, entry: TooltipEntry) => string;
}

/**
 * Returns a string unchanged, a number through `String`, and an empty string for any other value.
 */
function textOf(value: unknown): string {
  if (typeof value === "string") return value;

  return typeof value === "number" ? String(value) : "";
}

/**
 * Returns an entry's `name` when a series has that key, else the entry's `dataKey`.
 *
 * @remarks
 *   A pie's sector reports its series key as `name`, and a cartesian mark as `dataKey`.
 */
function keyOf(entry: TooltipEntry, series: readonly Series[]): string {
  const name = textOf(entry.name);

  return series.some((each) => each.key === name) ? name : textOf(entry.dataKey);
}

/**
 * Returns the label of the series an entry belongs to, or the entry's key without a series.
 */
function labelOf(entry: TooltipEntry, series: readonly Series[]): ReactNode {
  const key = keyOf(entry, series);

  return series.find((each) => each.key === key)?.label ?? key;
}

/**
 * Returns the tooltip's heading: what `headingOf` returns for the entries shown where it is
 * stated, else the category written by `formatLabel`.
 */
function headingText(
  props: Pick<TooltipProps, "formatLabel" | "headingOf" | "label">,
  shown: readonly TooltipEntry[],
): ReactNode {
  const { formatLabel, headingOf, label } = props;

  return headingOf === undefined ? (formatLabel ?? textOf)(label) : headingOf(shown);
}

/**
 * Returns the writers of a row per shown series: the caller's where stated, else the series' key,
 * color and label and a number in the chart's locale.
 *
 * @param props - The caller's writers.
 * @param chart - The chart whose series the entries belong to.
 */
function writersOf(
  { entryColor, formatValue, nameOf }: Pick<TooltipProps, "entryColor" | "formatValue" | "nameOf">,
  chart: ChartApi,
): Writers {
  /**
   * Returns the key of an entry's series.
   */
  const keyed = (entry: TooltipEntry): string => keyOf(entry, chart.series);

  return {
    colored: entryColor ?? ((entry) => chart.color(keyed(entry))),
    keyed,
    named: nameOf ?? ((entry) => labelOf(entry, chart.series)),
    valued: formatValue ?? chart.formatNumber(),
  };
}

/**
 * Returns a row per shown series: its swatch, its name and its value.
 */
function seriesRowsOf(shown: readonly TooltipEntry[], writers: Writers): ReactElement[] {
  return shown.map((entry) => (
    <Row key={writers.keyed(entry)}>
      <ColorSwatch aria-hidden size="xs" value={writers.colored(entry)} />
      <Name>{writers.named(entry)}</Name>
      <Value>{writers.valued(entry.value, entry)}</Value>
    </Row>
  ));
}

/**
 * Returns a row per number about one datum: its name and its value, without a swatch.
 */
function factRowsOf(rows: readonly TooltipRow[]): ReactElement[] {
  return rows.map((row) => (
    <Row key={row.key}>
      <Name>{row.name}</Name>
      <Value>{row.value}</Value>
    </Row>
  ));
}

/**
 * Returns a row per note: its swatch and its words.
 */
function noteRowsOf(notes: readonly TooltipNote[]): ReactElement[] {
  return notes.map((note) => (
    <Row key={note.key}>
      <ColorSwatch aria-hidden size="xs" value={note.color} />
      <Name>{note.text}</Name>
    </Row>
  ));
}

/**
 * Renders the panel, with the category and a row per shown series while recharts shows the
 * tooltip, or the rows `rowsOf` returns, then the notes about the category.
 *
 * @param props - The formatters, and what recharts passes.
 */
export function Tooltip({
  accessibilityLayer,
  active,
  formatLabel,
  headingOf,
  label,
  notesOf,
  payload,
  rowsOf,
  ...writers
}: TooltipProps): ReactElement {
  const chart = useChartContext();

  /**
   * Returns the place of an entry's series in the legend.
   */
  const placeOf = (entry: TooltipEntry): number =>
    chart.series.findIndex((each) => each.key === keyOf(entry, chart.series));
  const shown = (payload ?? [])
    .filter((entry) => !chart.hidden(keyOf(entry, chart.series)))
    .toSorted((first, second) => placeOf(first) - placeOf(second));
  const heading = headingText({ formatLabel, headingOf, label }, shown);
  const rows =
    rowsOf === undefined
      ? seriesRowsOf(shown, writersOf(writers, chart))
      : factRowsOf(rowsOf(shown));

  return (
    <Panel aria-live={accessibilityLayer === false ? "off" : "assertive"}>
      {active === true && shown.length > 0 ? (
        <>
          {heading === "" ? null : <Heading>{heading}</Heading>}
          {rows}
          {notesOf === undefined ? null : noteRowsOf(notesOf(label))}
        </>
      ) : null}
    </Panel>
  );
}
