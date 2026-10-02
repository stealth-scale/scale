/**
 * Provides `boxed` and the marks the root takes to every ready-made row.
 *
 * @remarks
 *   Every row of a list renders the same checkbox or end mark, so the root takes `boxed` and the
 *   marks once and every row reads them here. The package contains no icons, so the marks are the
 *   caller's.
 */

import { type ReactNode } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the settings every ready-made row reads: `boxed` and the two marks.
 */
export interface Shown {
  /**
   * Whether every row renders a checkbox at its start.
   */
  boxed: boolean;

  /**
   * Mark a selected row renders, in its checkbox or at its end.
   */
  mark?: ReactNode | undefined;

  /**
   * Mark the select-all checkbox renders while part of the list is selected.
   */
  mixedMark?: ReactNode | undefined;
}

/**
 * Provides the settings to the ready-made parts, and reads them back.
 */
export const [ShownProvider, useShown] = createRequiredContext<Shown>("Listbox");
