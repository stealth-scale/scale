/**
 * Renders a graph's caption: the finding in words, which names the figure.
 *
 * @remarks
 *   A screen reader reads nothing from the canvas's shapes, so the caption states what the graph
 *   shows. The caption reports itself to the root while it renders, and the root points the
 *   figure's `aria-labelledby` at it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#graph/context.ts";
import { useCaptionId, useLabelled } from "#graph/state.ts";

/**
 * Renders the `figcaption` with the recipe's caption class.
 */
const Shown = withContext("figcaption", "caption");

/**
 * Describes the props of the caption: the props of a `figcaption`.
 */
export type CaptionProps = ComponentProps<typeof Shown>;

/**
 * Renders the caption with the ID the root names the figure by.
 *
 * @param props - The props of the `figcaption`.
 */
export function Caption(props: CaptionProps): ReactElement {
  useLabelled();

  return <Shown id={useCaptionId()} {...props} />;
}
