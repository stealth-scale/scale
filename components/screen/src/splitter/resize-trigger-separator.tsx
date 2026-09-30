/**
 * Renders the line along the middle of a resize trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#splitter/context.ts";
import { useSplitterContext } from "#splitter/machine.ts";

/**
 * Renders the `div` with the recipe's separator class.
 */
const Drawn = withContext("div", "resizeTriggerSeparator");

/**
 * Describes the props of the line: the props of a `div`.
 */
export type ResizeTriggerSeparatorProps = ComponentProps<typeof Drawn>;

/**
 * Renders the line with the splitter's orientation, which decides which way it runs.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ResizeTriggerSeparator(props: ResizeTriggerSeparatorProps): ReactElement {
  const api = useSplitterContext();

  return <Drawn data-orientation={api.orientation} {...props} />;
}
