/**
 * Measures whether the four statuses can be told from each other, from the primary and from the
 * neutral as solids, and whether each keeps the hue its name is read from, in both modes.
 *
 * @remarks
 *   A status is read from its color before its word, so information, success, warning and error
 *   have to keep a distance from each other and from the brand in OKLab, and each has to sit near
 *   the hue a reader expects of it. The gate holds the solids to both. The inks are measured for
 *   the report alone, because an ink that reads at 7:1 on a dark page is a pale tint whatever its
 *   hue, and four pale tints sit close together however well the theme is drawn. The distance
 *   under a color vision deficiency is reported rather than gated for the same reason: a red and a
 *   green converge for a reader with deuteranopia whatever the theme does, and the recipe pairs
 *   each status with an icon for that reader.
 */

import {
  type Mode,
  MODES,
  oklab,
  STATUS_HUES,
  STATUSES,
  type Theme,
} from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { colorAt, type Resolving } from "#theme.ts";
import { distance } from "#vision.ts";

/**
 * Lists the roles a status is read from: its fill and its ink.
 */
const READ_FROM = ["solid", "fg"];

/**
 * Fixes the role the gate holds the statuses apart on.
 */
const GATED = "solid";

/**
 * Lists the brand palettes every status has to keep its distance from.
 */
const BRAND = ["primary", "neutral"];

/**
 * Fixes the chroma below which a color is a grey and carries no hue.
 */
const GREY = 0.01;

/**
 * Describes one pair of statuses to measure on one role.
 */
export interface StatusPair {
  /**
   * The first status.
   */
  one: string;

  /**
   * The second status.
   */
  other: string;

  /**
   * The role both are read on.
   */
  role: string;
}

/**
 * Lists every pair of statuses on each role, each pair once.
 */
export function statusPairs(): readonly StatusPair[] {
  return READ_FROM.flatMap((role) =>
    STATUSES.flatMap((one, index) =>
      STATUSES.slice(index + 1).map((other) => ({ one, other, role })),
    ),
  );
}

/**
 * Measures the distance between two statuses on one role in one mode.
 *
 * @returns The OKLab distance, or `NaN` where either color cannot be resolved.
 */
export function statusDistance(
  theme: Theme,
  pair: StatusPair,
  mode: Mode,
  options: Resolving,
): number {
  const first = colorAt(theme, `${pair.one}.${pair.role}`, mode, options);
  const second = colorAt(theme, `${pair.other}.${pair.role}`, mode, options);

  return first === undefined || second === undefined ? Number.NaN : distance(first, second);
}

/**
 * Reports each pair of statuses, and each status and brand palette, closer than the status
 * distance on their solids, in either mode, or one that could not be measured.
 */
export function distinct(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  const gated = [
    ...statusPairs().filter((pair) => pair.role === GATED),
    ...STATUSES.flatMap((one) => BRAND.map((other) => ({ one, other, role: GATED }))),
  ];

  return MODES.flatMap((mode) =>
    gated.flatMap((pair) => {
      const apart = statusDistance(theme, pair, mode, options);
      const where = `${pair.one}.${pair.role} and ${pair.other}.${pair.role}`;

      if (Number.isNaN(apart)) return [`${theme.name} ${where} cannot be measured in ${mode}`];
      if (apart >= thresholds.status) return [];

      return [
        `${theme.name} ${where} differ by ${apart.toFixed(3)} in ${mode}, below ${String(thresholds.status)}`,
      ];
    }),
  );
}

/**
 * Reads the hue of a color in degrees, or nothing for a grey or a color that cannot be read.
 */
function hueOf(color: string): number | undefined {
  const lab = oklab(color);

  if (lab === undefined || Math.hypot(lab.a, lab.b) < GREY) return undefined;

  return ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360;
}

/**
 * Measures how many degrees apart two hues are, the short way round the wheel.
 */
function drift(hue: number, canonical: number): number {
  const apart = Math.abs(hue - canonical) % 360;

  return Math.min(apart, 360 - apart);
}

/**
 * Reports each status whose solid sits further from the canonical hue of its status than the
 * identity threshold, in either mode, and one whose solid is a grey or cannot be measured.
 */
export function identity(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return MODES.flatMap((mode) =>
    STATUSES.flatMap((status) => {
      const where = `${theme.name} ${status}.${GATED}`;
      const color = colorAt(theme, `${status}.${GATED}`, mode, options);

      if (color === undefined) return [`${where} cannot be measured in ${mode}`];

      const hue = hueOf(color);
      const canonical = STATUS_HUES[status];

      if (hue === undefined) return [`${where} has no hue in ${mode}`];

      const apart = drift(hue, canonical);

      if (apart <= thresholds.identity) return [];

      return [
        `${where} sits ${apart.toFixed(0)} degrees from ${String(canonical)} in ${mode}, above ${String(thresholds.identity)}`,
      ];
    }),
  );
}
