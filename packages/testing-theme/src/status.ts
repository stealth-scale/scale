/**
 * Measures whether the four statuses can be told apart from each other, from the primary and from
 * the neutral as solids, and whether each keeps its canonical hue, in both modes.
 *
 * @remarks
 *   A status is identified by its color before its word, so information, success, warning and error
 *   have to keep a distance from each other and from the brand in OKLab, and each has to sit near
 *   the canonical hue of its status. The gate holds the solids to both. The inks are measured for
 *   the report alone, because an ink that reaches 7:1 on a dark page is a pale tint whatever its
 *   hue and four pale tints sit close together. The distance under a color vision deficiency is
 *   reported and not gated for the same reason: a red and a green converge under deuteranopia
 *   whatever the theme does, and the recipe pairs each status with an icon.
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
 * The roles a status is read from: its fill and its ink.
 */
const READ_FROM = ["solid", "fg"];

/**
 * The one role of {@link READ_FROM} the gate holds the statuses apart on.
 */
const GATED = "solid";

/**
 * The brand palettes every status has to keep its distance from.
 */
const BRAND = ["primary", "neutral"];

/**
 * The OKLab chroma below which a color counts as a grey and has no hue to measure.
 */
const GREY = 0.01;

/**
 * One pair of statuses to measure on one role.
 */
export interface StatusPair {
  /**
   * The first status of the pair.
   */
  one: string;

  /**
   * The second status of the pair.
   */
  other: string;

  /**
   * The role both are read on.
   */
  role: string;
}

/**
 * Enumerates every unordered pair of statuses on each role, each pair once.
 *
 * @returns One entry per pair and role, so four statuses over two roles give twelve.
 */
export function statusPairs(): readonly StatusPair[] {
  return READ_FROM.flatMap((role) =>
    STATUSES.flatMap((one, index) =>
      STATUSES.slice(index + 1).map((other) => ({ one, other, role })),
    ),
  );
}

/**
 * Measures how far apart a pair's two statuses sit on one role in one mode.
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
 * Reports each pair of statuses, and each status and brand palette, whose solids sit closer than
 * the status threshold in either mode, and each pair that could not be measured.
 *
 * @returns One line per failing pair and mode, naming the distance and the threshold. Empty when
 *   every pair clears it.
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
 * Returns a color's OKLab hue angle in degrees, from 0 to 360.
 *
 * @returns The angle, or undefined for a color that cannot be read or whose chroma is below
 *   {@link GREY}.
 */
function hueOf(color: string): number | undefined {
  const lab = oklab(color);

  if (lab === undefined || Math.hypot(lab.a, lab.b) < GREY) return undefined;

  return ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360;
}

/**
 * Measures how many degrees apart two hue angles are, the short way round the wheel.
 *
 * @returns A value from 0 to 180.
 */
function drift(hue: number, canonical: number): number {
  const apart = Math.abs(hue - canonical) % 360;

  return Math.min(apart, 360 - apart);
}

/**
 * Reports each status whose solid drifts further from its canonical hue than the identity
 * threshold allows, in either mode, and each whose solid is a grey or cannot be measured.
 *
 * @returns One line per failing status and mode, naming the drift and the threshold. Empty when
 *   every status clears it.
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
