/**
 * Renders a mark's name in a radial chart's legend, with its value written beside it in the chart's
 * locale, because an arc or a radius is not read for a quantity.
 */

import { type ReactElement, type ReactNode } from "react";

import { useChartContext } from "#chart/use-chart.ts";

/**
 * Describes the props of a mark's label: its name, its value and the options the value is written
 * with.
 */
export interface ValueLabelProps {
  /**
   * Name of the mark.
   */
  readonly label: ReactNode;

  /**
   * `Intl.NumberFormat` options the value is written with.
   */
  readonly options: Intl.NumberFormatOptions | undefined;

  /**
   * Value of the mark.
   */
  readonly value: number;
}

/**
 * Renders the name, a space and the value.
 *
 * @param props - The name, the value and its options.
 */
export function ValueLabel({ label, options, value }: ValueLabelProps): ReactElement {
  const chart = useChartContext();

  return (
    <>
      {label} {chart.formatNumber(options)(value)}
    </>
  );
}
