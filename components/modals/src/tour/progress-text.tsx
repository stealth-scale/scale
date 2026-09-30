/**
 * Renders how far through the tour the current step is.
 *
 * @remarks
 *   The text counts the steps a person sees, so a wait step adds nothing to it. It reads "2 of 4"
 *   unless the caller passes children, which is how a translated application words it. Inside
 *   `Tour.Control` the text is at the start of the row, before the buttons.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's progress text class.
 */
const Drawn = withContext("div", "progressText");

/**
 * Describes the props of the progress text: the props of a `div`.
 */
export type ProgressTextProps = ComponentProps<typeof Drawn>;

/**
 * Renders the progress text with the machine's progress text props merged over the caller's.
 *
 * @param props - The props of a `div`, whose children replace the English count.
 * @returns The `div` element.
 */
export function ProgressText({ children, ...props }: ProgressTextProps): ReactElement {
  const api = useTourContext();

  return (
    <Drawn {...mergeProps(api.getProgressTextProps(), props)}>
      {children ?? api.getProgressText()}
    </Drawn>
  );
}
