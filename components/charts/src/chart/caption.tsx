/**
 * Renders the chart's caption as the figure's accessible name.
 *
 * @remarks
 *   The `figcaption` takes the ID the root generates and registers itself, and the root points
 *   `aria-labelledby` at that ID while the caption renders. A screen reader reads nothing from a
 *   plot's paths, so the caption states the finding: "Refunds doubled after Tuesday's release",
 *   not "Line chart of refunds".
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#chart/context.ts";
import { useCaptionId, useLabelled } from "#chart/labelling.ts";

/**
 * Renders the `figcaption` with the chart's caption class.
 */
const Figcaption = withContext("figcaption", "caption");

/**
 * Describes the props of the caption: the props of a `figcaption`.
 */
export type CaptionProps = ComponentProps<typeof Figcaption>;

/**
 * Renders the caption with the ID the figure is labelled by.
 *
 * @param props - The finding and the props of a `figcaption`.
 */
export function Caption(props: CaptionProps): ReactElement {
  const id = useCaptionId();

  useLabelled();

  return <Figcaption {...props} id={id} />;
}
