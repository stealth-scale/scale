/**
 * Measures the shape of every ramp a theme draws: whether its steps run one way in lightness,
 * hold one hue, and stay inside the display's gamut.
 *
 * @remarks
 *   A ramp is a group of tokens under `tokens.colors` whose steps are keyed by number, with a
 *   dark ramp nested under the light one where a theme draws both. A group of fewer than three
 *   numbered steps is a set of constants rather than a ramp, and is passed over. The hue is
 *   measured only where a step has chroma, because a near-grey step has no hue to hold.
 */

import { linear, oklab, type Oklab, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { isToken } from "#tokens.ts";

/**
 * Describes one ramp: its path under the color tokens and its numbered steps in ascending order,
 * each with the color it is drawn in.
 */
export interface Ramp {
  /**
   * The dotted path under `tokens.colors`.
   */
  path: string;

  /**
   * The numbered steps, from the lowest number to the highest.
   */
  steps: ReadonlyArray<readonly [step: number, color: string]>;
}

/**
 * Fixes the number of numbered steps a group needs before it is read as a ramp.
 */
const FEWEST = 3;

/**
 * Fixes the chroma below which a step is a grey with no hue to hold.
 */
const GREY = 0.04;

/**
 * Fixes how far outside 0 to 1 a linear channel may sit before the color is outside sRGB, which
 * absorbs the rounding a theme writes its steps at.
 */
const SLACK = 0.002;

/**
 * Fixes the difference in lightness below which two steps sit at one lightness, which absorbs
 * the rounding of a round trip through sRGB.
 */
const FLAT = 0.0001;

/**
 * Reads a token's value as a string, or undefined where the node is not a token or its value is
 * anything else.
 */
function stringValue(node: unknown): string | undefined {
  const value: unknown = isToken(node) ? Reflect.get(node, "value") : undefined;

  return typeof value === "string" ? value : undefined;
}

/**
 * Reports whether a color carries transparency, which every step of an alpha ramp does.
 */
function transparent(color: string): boolean {
  return (
    color.includes("/") || /^#(?:[\da-f]{4}|[\da-f]{8})$/iu.test(color) || color.includes("rgba(")
  );
}

/**
 * Reads every ramp under a block of color tokens, the nested ones included.
 *
 * @remarks
 *   A node that is not a token with a string value is walked as a group. A token whose value is
 *   an object is walked the same way and yields no step, because none of its keys is a number. An
 *   alpha ramp is left out: its steps differ in transparency rather than in lightness, so the
 *   lightness, hue and gamut checks say nothing about it, and what a reader sees through it is
 *   whatever it was painted over.
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
 * Lists every ramp a theme draws under its color tokens.
 */
export function rampsOf(theme: Theme): readonly Ramp[] {
  const tokens: unknown = theme.variant.tokens;
  const colors: unknown =
    typeof tokens === "object" && tokens !== null ? Reflect.get(tokens, "colors") : undefined;

  return rampsIn(colors, "");
}

/**
 * Reads the OKLab point of each step, or undefined for a step that cannot be read.
 */
function points(ramp: Ramp): ReadonlyArray<readonly [step: number, point: Oklab | undefined]> {
  return ramp.steps.map(([step, color]) => [step, oklab(color)] as const);
}

/**
 * Pairs each value of a sequence with the one before it.
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
 * Finds the two steps between which a ramp's lightness turns back on itself: the first pair that
 * runs against the way the ramp set out.
 *
 * @returns The steps either side of the turn, or undefined where the ramp never turns.
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
 * Reports a ramp whose lightness turns back on itself between two steps, or a step that cannot
 * be read. Two steps at the same lightness are a plateau rather than a turn.
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
 * Measures the hue of an OKLab point in degrees, or undefined for a grey.
 */
function hueOf(point: Oklab): number | undefined {
  if (Math.hypot(point.a, point.b) < GREY) return undefined;

  const degrees = (Math.atan2(point.b, point.a) * 180) / Math.PI;

  return degrees < 0 ? degrees + 360 : degrees;
}

/**
 * Measures the shortest way round the wheel between two hues.
 */
function around(one: number, other: number): number {
  const difference = Math.abs(one - other) % 360;

  return difference > 180 ? 360 - difference : difference;
}

/**
 * Reports a step whose hue drifts from the ramp's median hue by more than the hue threshold.
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
 * Lists each step outside the sRGB gamut, as `blue step 500`.
 *
 * @remarks
 *   A display without a wider gamut maps such a step to a color the theme did not write. A step
 *   that cannot be read is left out, because it is reported by the monotonic check.
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
 * Reports each step outside the sRGB gamut.
 *
 * @remarks
 *   Not a gate. The foundation's own ramps and a palette drawn for a wide-gamut display place
 *   steps outside sRGB on purpose, so the report counts them and a theme that wants none runs
 *   this in its own specification.
 */
export function gamut(theme: Theme): readonly string[] {
  return outsideGamut(theme).map((where) => `${theme.name} ${where} is outside sRGB`);
}
