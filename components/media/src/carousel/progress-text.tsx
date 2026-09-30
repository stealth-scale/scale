/**
 * Renders the text that states the current page and the number of pages.
 *
 * @remarks
 *   The text is "2 / 5" unless the caller passes `text`. The element is a `span` and no live
 *   region, because the scroller already announces the slide a reader moved to.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ProgressTextDetails } from "@zag-js/carousel";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#carousel/context.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `span` with the carousel's progress text class.
 */
const Drawn = withContext("span", "progressText");

/**
 * Describes the props of the progress text: its words and the props of a `span` without children.
 */
export interface ProgressTextProps extends Omit<ComponentProps<typeof Drawn>, "children"> {
  /**
   * Returns the text from the current page and the number of pages, both counted from one.
   */
  readonly text?: ((details: ProgressTextDetails) => string) | undefined;
}

/**
 * Renders the progress text.
 *
 * @param props - The words and the props of a `span`.
 * @returns The `span` element.
 */
export function ProgressText({ text, ...rest }: ProgressTextProps): ReactElement {
  const { api } = useCarousel();
  const details = { page: api.page + 1, totalPages: api.pageSnapPoints.length };

  return (
    <Drawn {...mergeProps(api.getProgressTextProps(), rest)}>
      {text?.(details) ?? api.getProgressText()}
    </Drawn>
  );
}
