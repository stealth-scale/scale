/**
 * Orders a pie's slices largest first and gathers the tail past `maxSlices` into one slice.
 */

import { type ReactNode } from "react";

import { type PieSlice } from "#polar/types.ts";

/**
 * Key of the slice the tail gathers into.
 */
export const OTHER = "other";

/**
 * Name of the slice the tail gathers into unless the chart states one.
 */
const OTHER_LABEL = "Other";

/**
 * Returns a slice's value, or zero for a value that is not a finite number.
 */
export function valueOf(slice: PieSlice): number {
  return Number.isFinite(slice.value) ? slice.value : 0;
}

/**
 * Returns the slices largest first, with the slices past `maxSlices` gathered into one.
 *
 * @remarks
 *   A pie is read by comparing each slice with its neighbours, so the slices are sorted. The
 *   gathered slice counts as one of the `maxSlices`, takes the key `other` and the neutral
 *   palette's chart color, and its value is the sum of the slices it gathers.
 * @param slices - The slices in any order.
 * @param maxSlices - The largest number of slices to render, or every slice.
 * @param otherLabel - The name of the gathered slice.
 */
export function slicesOf(
  slices: readonly PieSlice[],
  maxSlices?: number,
  otherLabel: ReactNode = OTHER_LABEL,
): PieSlice[] {
  const sorted = slices.toSorted((first, second) => valueOf(second) - valueOf(first));

  if (maxSlices === undefined || maxSlices < 1 || sorted.length <= maxSlices) return sorted;

  const tail = sorted.slice(maxSlices - 1);

  return [
    ...sorted.slice(0, maxSlices - 1),
    {
      color: "neutral",
      key: OTHER,
      label: otherLabel,
      value: tail.reduce((sum, slice) => sum + valueOf(slice), 0),
    },
  ];
}
