/**
 * Measures a theme and reports the numbers instead of a verdict: how much room each class of pair
 * has above its ratio, how far apart the steps are, and how far apart the statuses are under
 * typical vision and under each dichromacy.
 *
 * @remarks
 *   The gate reports whether a theme breaks the contract. The report measures how much margin it
 *   has. A theme that passes every pair at 4.51 is one rounding away from failing, and the
 *   tightest pairs show that before any check does.
 */

import { type Mode, MODES, type Theme } from "@stealthscale/theme/authoring";

import {
  boundaryPairs,
  focusPairs,
  type Measured,
  measured,
  textPairs,
  THRESHOLDS,
  type Thresholds,
} from "#contrast.ts";
import { consecutive, outsideGamut } from "#ramp.ts";
import { statusDistance, statusPairs } from "#status.ts";
import { colorAt, lightnessAt, type Resolving } from "#theme.ts";
import { type ThemeChecks } from "#violations.ts";
import { DEFICIENCIES, type Deficiency, distanceFor } from "#vision.ts";

/**
 * How many of the tightest pairs a report lists per class.
 */
const TIGHTEST = 10;

/**
 * One class of pairs as measured: the least room, the middle, and the pairs with the least room in
 * the order they have it.
 */
export interface Margin {
  /**
   * Middle ratio of the class, or `NaN` where no pair in it could be measured.
   */
  median: number;

  /**
   * Lowest ratio of the class, or `NaN` where any one pair could not be measured.
   */
  minimum: number;

  /**
   * Pairs with the least room, lowest first, with any pair that could not be measured ahead of
   * them.
   */
  tightest: readonly Measured[];
}

/**
 * The lightness between consecutive steps of the surfaces, the inks and the lines, in one mode.
 */
export interface Steps {
  /**
   * Lightness between `fg`, `fg.muted` and `fg.subtle`.
   */
  inks: readonly number[];

  /**
   * Lightness between `border.subtle`, `border.muted`, `border` and `border.emphasized`.
   */
  lines: readonly number[];

  /**
   * Lightness between `bg`, `bg.subtle`, `bg.muted` and `bg.emphasized`.
   */
  surfaces: readonly number[];
}

/**
 * One pair of statuses, measured under typical vision and under each dichromacy.
 */
export interface StatusApart {
  /**
   * Distance under typical vision.
   */
  normal: number;

  /**
   * Pair, written as `success.solid and error.solid`.
   */
  pair: string;

  /**
   * Distance for a reader with each dichromacy.
   */
  simulated: Readonly<Record<Deficiency, number>>;
}

/**
 * Everything a report measures about one theme.
 */
export interface ThemeReport {
  /**
   * Room each class of pair has, at the thresholds the report was asked for.
   */
  margins: Readonly<Record<"boundary" | "focus" | "text", Margin>>;

  /**
   * The theme's name.
   */
  name: string;

  /**
   * Steps of the theme's own ramps that sit outside sRGB, as `blue step 500`.
   */
  outside: readonly string[];

  /**
   * How far the statuses are from each other, per mode.
   */
  statuses: Readonly<Record<Mode, readonly StatusApart[]>>;

  /**
   * How far each step is from the next, per mode.
   */
  steps: Readonly<Record<Mode, Steps>>;
}

/**
 * The sequences a report measures the steps of, each in the order its steps run.
 */
const SEQUENCES: Readonly<Record<keyof Steps, readonly string[]>> = {
  inks: ["fg", "fg.muted", "fg.subtle"],
  lines: ["border.subtle", "border.muted", "border", "border.emphasized"],
  surfaces: ["bg", "bg.subtle", "bg.muted", "bg.emphasized"],
};

/**
 * Orders two measured pairs by the room they have, with a pair that could not be measured before
 * every pair that could.
 *
 * @remarks
 *   A comparator that subtracts `NaN` returns `NaN`, which a sort reads as equal, and one such
 *   pair leaves the whole order undefined.
 */
function tighter(one: Measured, other: Measured): number {
  if (Number.isNaN(one.ratio)) return Number.isNaN(other.ratio) ? 0 : -1;
  if (Number.isNaN(other.ratio)) return 1;

  return one.ratio - other.ratio;
}

/**
 * Reduces one class of measured pairs to its lowest ratio, its median, and its tightest pairs.
 */
function margin(pairs: readonly Measured[]): Margin {
  const ratios = pairs.map(({ ratio }) => ratio);
  const sorted = ratios
    .filter((ratio) => !Number.isNaN(ratio))
    .toSorted((one, other) => one - other);
  const tightest = pairs.toSorted(tighter).slice(0, TIGHTEST);

  return {
    median: sorted[Math.floor(sorted.length / 2)] ?? Number.NaN,
    minimum: ratios.some((ratio) => Number.isNaN(ratio)) ? Number.NaN : (sorted[0] ?? Number.NaN),
    tightest,
  };
}

/**
 * Measures the lightness between each consecutive pair of one sequence, in one mode.
 */
function deltas(
  theme: Theme,
  sequence: readonly string[],
  mode: Mode,
  options: Resolving,
): readonly number[] {
  const lightnesses = sequence.map((path) => lightnessAt(theme, path, mode, options) ?? Number.NaN);

  return consecutive(lightnesses).map(([before, after]) => Math.abs(after - before));
}

/**
 * Measures how far apart two colors are for each dichromacy, or `NaN` where either is missing.
 */
function seenBy(first: string | undefined, second: string | undefined): Record<Deficiency, number> {
  if (first === undefined || second === undefined) {
    return { deuteranopia: Number.NaN, protanopia: Number.NaN, tritanopia: Number.NaN };
  }

  return {
    deuteranopia: distanceFor(first, second, "deuteranopia"),
    protanopia: distanceFor(first, second, "protanopia"),
    tritanopia: distanceFor(first, second, "tritanopia"),
  };
}

/**
 * Measures how far apart each pair of statuses is in one mode, for every reader.
 */
function statusesIn(theme: Theme, mode: Mode, options: Resolving): readonly StatusApart[] {
  return statusPairs().map((pair) => ({
    normal: statusDistance(theme, pair, mode, options),
    pair: `${pair.one}.${pair.role} and ${pair.other}.${pair.role}`,
    simulated: seenBy(
      colorAt(theme, `${pair.one}.${pair.role}`, mode, options),
      colorAt(theme, `${pair.other}.${pair.role}`, mode, options),
    ),
  }));
}

/**
 * Runs one measurement in each mode, keyed by mode.
 */
function perMode<Value>(measure: (mode: Mode) => Value): Record<Mode, Value> {
  return { _dark: measure("_dark"), base: measure("base") };
}

/**
 * Measures a theme and reports the numbers.
 *
 * @remarks
 *   The options are the ones `violations` takes: the preset beneath the theme, and the thresholds
 *   the margins are read against.
 */
export function report(theme: Theme, options: ThemeChecks = {}): ThemeReport {
  const thresholds: Thresholds = { ...THRESHOLDS, ...options.thresholds };
  const resolving: Resolving = { base: options.base };

  return {
    margins: {
      boundary: margin(measured(theme, boundaryPairs(theme, thresholds), resolving)),
      focus: margin(measured(theme, focusPairs(theme, thresholds), resolving)),
      text: margin(measured(theme, textPairs(theme, thresholds), resolving)),
    },
    name: theme.name,
    outside: outsideGamut(theme),
    statuses: perMode((mode) => statusesIn(theme, mode, resolving)),
    steps: perMode((mode) => ({
      inks: deltas(theme, SEQUENCES.inks, mode, resolving),
      lines: deltas(theme, SEQUENCES.lines, mode, resolving),
      surfaces: deltas(theme, SEQUENCES.surfaces, mode, resolving),
    })),
  };
}

/**
 * Writes a number with two decimals, or a dash where it could not be measured.
 */
function cell(value: number): string {
  return Number.isNaN(value) ? "-" : value.toFixed(2);
}

/**
 * Writes a list of numbers into one cell, comma separated.
 */
function cells(values: readonly number[]): string {
  return values.map((value) => cell(value)).join(", ");
}

/**
 * Writes the rows of the margins table, one per class of pair, each naming its tightest pair.
 */
function marginRows(margins: ThemeReport["margins"]): readonly string[] {
  return Object.entries(margins).map(([name, { median, minimum, tightest }]) => {
    const first = tightest[0];
    const where = first === undefined ? "-" : `${first.front} on ${first.back} in ${first.mode}`;

    return `| ${name} | ${cell(minimum)} | ${cell(median)} | ${where} |`;
  });
}

/**
 * Writes the rows of the steps table, one per mode.
 */
function stepRows(steps: ThemeReport["steps"]): readonly string[] {
  return MODES.map((mode) => {
    const { inks, lines, surfaces } = steps[mode];

    return `| ${mode} | ${cells(surfaces)} | ${cells(inks)} | ${cells(lines)} |`;
  });
}

/**
 * Writes the rows of the statuses table, one per pair per mode.
 */
function statusRows(statuses: ThemeReport["statuses"]): readonly string[] {
  return MODES.flatMap((mode) =>
    statuses[mode].map(({ normal, pair, simulated }) => {
      const seen = DEFICIENCIES.map((deficiency) => cell(simulated[deficiency])).join(" | ");

      return `| ${mode} | ${pair} | ${cell(normal)} | ${seen} |`;
    }),
  );
}

/**
 * Writes a report as Markdown, one table per section, for a person to read.
 */
export function formatReport(numbers: ThemeReport): string {
  return `${[
    `# ${numbers.name}`,
    "",
    "| Pairs | Minimum | Median | Tightest |",
    "| --- | --- | --- | --- |",
    ...marginRows(numbers.margins),
    "",
    "| Mode | Surfaces | Inks | Lines |",
    "| --- | --- | --- | --- |",
    ...stepRows(numbers.steps),
    "",
    "| Mode | Statuses | Typical | Protanopia | Deuteranopia | Tritanopia |",
    "| --- | --- | --- | --- | --- | --- |",
    ...statusRows(numbers.statuses),
    "",
    `Outside sRGB: ${numbers.outside.length === 0 ? "none" : numbers.outside.join(", ")}.`,
  ].join("\n")}\n`;
}
