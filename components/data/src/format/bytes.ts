/**
 * Writes a size in bytes or bits the way a locale writes it.
 */

import { formatBytes, formatNumber } from "@zag-js/i18n-utils";

/**
 * Describes how a size is written.
 */
export interface ByteOptions {
  /**
   * Significant digits of a size in a larger unit, 3 unless stated.
   */
  readonly precision?: number | undefined;

  /**
   * Whether the size counts bytes or bits.
   */
  readonly unit: "bit" | "byte";

  /**
   * Length of the unit's name: `short` ("kB"), `long` ("kilobytes") or `narrow` ("kB").
   */
  readonly unitDisplay: "long" | "narrow" | "short";

  /**
   * Whether a larger unit is a thousand of the smaller (`decimal`) or 1024 (`binary`).
   */
  readonly unitSystem: "binary" | "decimal";
}

/**
 * Returns the size written in the locale.
 *
 * @remarks
 *   A size under one kilo-unit is written with the unit's long name where the short one is asked
 *   for: `Intl`'s short English name for a byte is "byte", which reads "512 byte", and
 *   `formatBytes` writes zero as "0 B" in every locale. Larger sizes go through `formatBytes`,
 *   which writes the decimal names under `binary` as well, because `Intl` names no kibibyte.
 * @param value - The size, in the unit.
 * @param locale - The locale it is written in.
 * @param options - The unit, its display, the unit system and the precision.
 */
export function bytesOf(value: number, locale: string, options: ByteOptions): string {
  const factor = options.unitSystem === "binary" ? 1024 : 1000;

  if (Math.abs(value) < factor) {
    return formatNumber(value, locale, {
      style: "unit",
      unit: options.unit,
      unitDisplay: options.unitDisplay === "short" ? "long" : options.unitDisplay,
    });
  }

  return formatBytes(value, locale, {
    precision: options.precision ?? 3,
    unit: options.unit,
    unitDisplay: options.unitDisplay,
    unitSystem: options.unitSystem,
  });
}
