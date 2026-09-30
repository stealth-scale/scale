/**
 * Renders a bullet graph's key: the target's tick and each named zone's tint, with their names.
 *
 * @remarks
 *   The tick takes the class the chart's tick takes, so the two share an ink under every theme and
 *   under forced colors. The zones are listed from the lowest to the highest, and a zone without a
 *   name is left out.
 */

import { type ReactElement } from "react";

import { TARGET_LABEL } from "#cartesian/bullet-text.ts";
import * as Chart from "#chart/index.ts";
import { TARGET } from "#chart/recipe.ts";
import { type GaugeZone, tintOf } from "#gauge-chart/bands.ts";

/**
 * Describes the props of the key: whether a series reads targets, the target's name and the zones.
 */
export interface BulletKeyProps {
  /**
   * Whether a series reads targets, which the key then names.
   */
  readonly targeted: boolean;

  /**
   * Word the target is named by. "Target" unless stated.
   */
  readonly targetLabel?: string | undefined;

  /**
   * Zones of the value axis.
   */
  readonly zones: readonly GaugeZone[];
}

/**
 * Renders the key's entries.
 *
 * @param props - Whether targets render, the target's name and the zones.
 */
export function BulletKey({
  targeted,
  targetLabel = TARGET_LABEL,
  zones,
}: BulletKeyProps): ReactElement {
  const named = zones
    .filter((zone) => zone.label !== undefined)
    .toSorted((first, second) => first.upTo - second.upTo);

  return (
    <Chart.Key>
      {targeted ? (
        <Chart.KeyItem
          glyph={
            <svg viewBox="0 0 16 16">
              <rect className={TARGET} height={12} width={2} x={7} y={2} />
            </svg>
          }
        >
          {targetLabel}
        </Chart.KeyItem>
      ) : null}
      {named.map((zone) => (
        <Chart.KeyItem
          glyph={
            <svg viewBox="0 0 16 16">
              <rect fill={tintOf(zone)} height={12} rx={2} width={12} x={2} y={2} />
            </svg>
          }
          key={String(zone.upTo)}
        >
          {zone.label}
        </Chart.KeyItem>
      ))}
    </Chart.Key>
  );
}
