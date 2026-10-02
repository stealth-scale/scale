/**
 * Checks the shape of a theme's ramps: lightness running one way, one hue throughout, and every
 * step inside the display's gamut.
 *
 * @remarks
 *   A ramp is a group under `tokens.colors` whose steps are keyed by number, with the dark ramp
 *   nested inside the light one where a theme declares both. Fewer than three numbered steps means
 *   a handful of constants rather than a ramp, and the walk skips it. Hue is only measured on steps
 *   with some chroma, since a near-grey has no hue to speak of.
 */

import { linear, oklab, type Oklab, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { isToken } from "#tokens.ts";

/**
 * One ramp: where it sits in the color tokens, and the color of each of its numbered steps.
 */
export interface Ramp {
  /**
   * The dotted path to the ramp under `tokens.colors`.
   */
  path: string;

  /**
   * The numbered steps, lowest number first.
   */
  steps: ReadonlyArray<readonly [step: number, color: string]>;
}

/**
 * The number of numbered steps a group needs before it is read as a ramp.
 */
const FEWEST = 3;

/**
 * The chroma below which a step is grey and has no hue worth measuring.
 */
const GREY = 0.04;

/**
 * The slack allowed on a linear channel outside 0 to 1 before the color counts as outside sRGB,
 * enough to absorb the rounding a theme writes its steps at.
 */
const SLACK = 0.002;

/**
 * The lightness difference below which two steps count as level, enough to absorb the rounding of a
 * round trip through sRGB.
 */
const FLAT = 0.0001;

/**
 * Reads a token's value when it is a string, and undefined for anything else.
 */
function stringValue(node: unknown): string | undefined {
  const value: unknown = isToken(node) ? Reflect.get(node, "value") : undefined;

  return typeof value === "string" ? value : undefined;
}

/**
 * Reports whether a color carries an alpha channel, as every step of an alpha ramp does.
 */
function transparent(color: string): boolean {
  return (
    color.includes("/") || /^#(?:[\da-f]{4}|[\da-f]{8})$/iu.test(color) || color.includes("rgba(")
  );
}

/**
 * Collects the ramps under a block of color tokens, nested ones included.
 *
 * @remarks
 *   Anything that is not a token with a string value is descended into as a group, including a
 *   token whose value is an object, which contributes no steps because none of its keys is a
 *   number. Alpha ramps are excluded: their steps vary in transparency rather than lightness, so
 *   the lightness, hue and gamut checks have nothing to say about them, and what shows through is
 *   decided by whatever sits underneath.
 */
function rampsIn(block: unknown, prefix: string): readonly Ramp[] {
  if (typeof block !== "object" || block === null) return [];

  const steps: Array<readonly [number, string]> = [];
  const nested: Ramp[] = [];

  for (const [name, node] of Object.entries(block)) {
    const path = prefix === "" ? name : `${prefix}.${name}`;
    const color = stringValue(node);

    if (color === undefined) {
      nested.push(...rampsIn(node, path));
    } else if (/^\d+$/u.test(name)) {
      steps.push([Number(name), color]);
    }
  }

  const own: Ramp[] =
    steps.length >= FEWEST && prefix !== "" && !steps.some(([, color]) => transparent(color))
      ? [{ path: prefix, steps: steps.toSorted(([one], [other]) => one - other) }]
      : [];

  return [...own, ...nested];
}

/**
 * Lists the ramps a theme declares under its color tokens.
 */
export function rampsOf(theme: Theme): readonly Ramp[] {
  const tokens: unknown = theme.variant.tokens;
  const colors: unknown =
    typeof tokens === "object" && tokens !== null ? Reflect.get(tokens, "colors") : undefined;

  return rampsIn(colors, "");
}

/**
 * Converts each step to OKLab, leaving undefined the steps whose color will not parse.
 */
function points(ramp: Ramp): ReadonlyArray<readonly [step: number, point: Oklab | undefined]> {
  return ramp.steps.map(([step, color]) => [step, oklab(color)] as const);
}

/**
 * Pairs every value in a sequence with the one before it.
 */
export function consecutive<Value>(
  values: readonly Value[],
): ReadonlyArray<readonly [before: Value, after: Value]> {
  const pairs: Array<readonly [Value, Value]> = [];
  let previous: readonly [Value] | undefined;

  for (const value of values) {
    if (previous !== undefined) pairs.push([previous[0], value]);
    previous = [value];
  }

  return pairs;
}

/**
 * Finds the first pair of steps whose lightness runs against the direction the ramp started in.
 *
 * @returns The steps either side of the reversal, or undefined when the ramp never reverses.
 */
function turn(
  steps: ReadonlyArray<readonly [step: number, lightness: number]>,
): readonly [from: number, to: number] | undefined {
  let direction = 0;

  for (const [before, after] of consecutive(steps)) {
    const difference = after[1] - before[1];
    const sign = Math.abs(difference) < FLAT ? 0 : Math.sign(difference);

    if (direction === 0) direction = sign;
    else if (sign !== 0 && sign !== direction) return [before[0], after[0]];
  }

  return undefined;
}

/**
 * Reports the ramps whose lightness doubles back, and the steps whose color will not parse.
 *
 * @remarks
 *   Two steps at the same lightness are a plateau, not a reversal. A ramp is allowed to hold still;
 *   it is not allowed to turn around.
 */
export function monotonic(theme: Theme): readonly string[] {
  return rampsOf(theme).flatMap((ramp) => {
    const read = points(ramp);
    const unread = read.find(([, point]) => point === undefined);

    if (unread !== undefined) {
      return [`${theme.name} ${ramp.path} step ${String(unread[0])} cannot be read`];
    }

    const lit = read.filter((entry): entry is readonly [number, Oklab] => entry[1] !== undefined);
    const turned = turn(lit.map(([step, point]) => [step, point.l] as const));

    if (turned === undefined) return [];

    return [
      `${theme.name} ${ramp.path} turns back in lightness between steps ${String(turned[0])} and ${String(turned[1])}`,
    ];
  });
}

/**
 * Takes the hue of an OKLab point in degrees, or undefined when the point is grey.
 */
function hueOf(point: Oklab): number | undefined {
  if (Math.hypot(point.a, point.b) < GREY) return undefined;

  const degrees = (Math.atan2(point.b, point.a) * 180) / Math.PI;

  return degrees < 0 ? degrees + 360 : degrees;
}

/**
 * Measures the shorter arc between two hues on the wheel.
 */
function around(one: number, other: number): number {
  const difference = Math.abs(one - other) % 360;

  return difference > 180 ? 360 - difference : difference;
}

/**
 * Reports the steps whose hue drifts from their ramp's median by more than the threshold allows.
 */
export function hue(theme: Theme, thresholds: Thresholds): readonly string[] {
  return rampsOf(theme).flatMap((ramp) => {
    const hues = points(ramp).flatMap(([step, point]) => {
      const degrees = point === undefined ? undefined : hueOf(point);

      return degrees === undefined ? [] : [[step, degrees] as const];
    });
    const sorted = hues.map(([, degrees]) => degrees).toSorted((one, other) => one - other);
    const median = sorted[Math.floor(sorted.length / 2)];

    if (median === undefined) return [];

    return hues.flatMap(([step, degrees]) => {
      const drift = around(degrees, median);

      if (drift <= thresholds.hue) return [];

      return [
        `${theme.name} ${ramp.path} step ${String(step)} drifts ${drift.toFixed(0)} degrees from the ramp's hue, above ${String(thresholds.hue)}`,
      ];
    });
  });
}

/**
 * Lists the steps outside the sRGB gamut, each as `blue step 500`.
 *
 * @remarks
 *   A display no wider than sRGB maps such a step to a color the theme never wrote. Steps that will
 *   not parse are skipped here; the monotonic check already reports those.
 */
export function outsideGamut(theme: Theme): readonly string[] {
  return rampsOf(theme).flatMap((ramp) =>
    ramp.steps.flatMap(([step, color]) => {
      const read = linear(color);

      if (read === undefined) return [];

      const outside = [read.red, read.green, read.blue].some(
        (channel) => channel < -SLACK || channel > 1 + SLACK,
      );

      return outside ? [`${ramp.path} step ${String(step)}`] : [];
    }),
  );
}

/**
 * Reports the steps outside the sRGB gamut, named with their theme.
 *
 * @remarks
 *   The gate does not run this one. The foundation's ramps, and any palette built for a wide-gamut
 *   display, put steps outside sRGB on purpose, so the report counts them instead of failing on
 *   them. A theme that wants none calls this from its own spec.
 */
export function gamut(theme: Theme): readonly string[] {
  return outsideGamut(theme).map((where) => `${theme.name} ${where} is outside sRGB`);
}
