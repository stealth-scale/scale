/**
 * Renders the mark between two parts of the count, such as a colon.
 *
 * @remarks
 *   The caller passes the mark as children. The mark is hidden from assistive technology, because
 *   the area's name reads the time as words.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#timer/context.ts";
import { useTimer } from "#timer/machine.ts";

/**
 * Renders the `span` with the timer's separator class.
 */
const Marked = withContext("span", "separator");

/**
 * Describes the props of a separator: the props of a `span`.
 */
export type SeparatorProps = ComponentProps<typeof Marked>;

/**
 * Renders a separator with the machine's props merged under the caller's.
 *
 * @param props - The props of a `span`, with the mark as children.
 * @returns The `span` element.
 */
export function Separator(props: SeparatorProps): ReactElement {
  const { api } = useTimer();

  return <Marked {...mergeProps(api.getSeparatorProps(), props)} />;
}
