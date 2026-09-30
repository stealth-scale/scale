/**
 * Renders the chart's figure and provides the chart `useChart` returns to the parts.
 *
 * @remarks
 *   The element is a `figure`, named by its `Chart.Caption` through `aria-labelledby` while a
 *   caption renders, because a screen reader reads a plot's paths as nothing. The root takes the
 *   recipe's `ratio`, which sets the height of the plot and of the empty state.
 */

import { type ComponentProps, type ReactElement, useId, useState } from "react";

import { withProvider } from "#chart/context.ts";
import { CaptionProvider, LabellingProvider } from "#chart/labelling.ts";
import { type ChartApi, ChartProvider } from "#chart/use-chart.ts";

/**
 * Renders the `figure` that provides the recipe's variants.
 */
const Figure = withProvider("figure", "root");

/**
 * Describes the props of the root: the chart, the recipe's variants and the props of a `figure`.
 */
export interface RootProps extends ComponentProps<typeof Figure> {
  /**
   * Chart `useChart` returns, which every part reads.
   */
  readonly chart: ChartApi;
}

/**
 * Renders the figure inside the chart's provider, named by its caption while one renders.
 *
 * @param props - The chart, the recipe's variants and the props of a `figure`.
 * @returns The `figure` element inside the chart's provider.
 */
export function Root({ chart, ...props }: RootProps): ReactElement {
  const captionId = useId();
  const [captioned, setCaptioned] = useState(false);

  return (
    <ChartProvider value={chart}>
      <LabellingProvider value={setCaptioned}>
        <CaptionProvider value={captionId}>
          <Figure aria-labelledby={captioned ? captionId : undefined} {...props} />
        </CaptionProvider>
      </LabellingProvider>
    </ChartProvider>
  );
}
