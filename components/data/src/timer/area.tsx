/**
 * Renders the element with the `timer` role around the count.
 *
 * @remarks
 *   The role is a live region that announces nothing while it ticks, so a screen reader reads the
 *   time when the reader moves to it. The role takes its name from the author and not from the
 *   figures, so the area is named by the time in words: `label`, or English words by default.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";
import { type Time } from "@zag-js/timer";

import { withContext } from "#timer/context.ts";
import { useTimer } from "#timer/machine.ts";
import { spoken } from "#timer/spoken.ts";

/**
 * Renders the `div` with the timer's area class.
 */
const Timed = withContext("div", "area");

/**
 * Describes the props of the area: the function that names it and the props of a `div`.
 */
export interface AreaProps extends ComponentProps<typeof Timed> {
  /**
   * Returns the area's accessible name for a time, such as "2 minutes, 5 seconds" in English by
   * default.
   */
  readonly label?: ((time: Time) => string) | undefined;
}

/**
 * Renders the area with the machine's props merged under the caller's.
 *
 * @param props - The naming function and the props of a `div`.
 * @returns The `div` element.
 */
export function Area({ label = spoken, ...props }: AreaProps): ReactElement {
  const { api } = useTimer();
  const area: AreaProps = { ...api.getAreaProps(), "aria-label": label(api.time) };

  return <Timed {...mergeProps(area, props)} />;
}
