/**
 * Renders the pill on the centre of a resize trigger, which takes the trigger's focus ring.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#splitter/context.ts";
import { useSplitterContext, useTriggerContext } from "#splitter/machine.ts";

/**
 * Renders the `div` with the recipe's indicator class.
 */
const Drawn = withContext("div", "resizeTriggerIndicator");

/**
 * Describes the props of the pill: the props of a `div`.
 */
export type ResizeTriggerIndicatorProps = ComponentProps<typeof Drawn>;

/**
 * Renders the pill with the machine's indicator props for its trigger merged under the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ResizeTriggerIndicator(props: ResizeTriggerIndicatorProps): ReactElement {
  const api = useSplitterContext();
  const trigger = useTriggerContext();

  return <Drawn {...mergeProps(api.getResizeTriggerIndicator(trigger), props)} />;
}
