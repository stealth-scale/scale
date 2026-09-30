/**
 * Renders one part of the count: the days, the hours, the minutes, the seconds or the
 * milliseconds.
 *
 * @remarks
 *   The part renders its figures padded to two digits, and the milliseconds to three. Each unit
 *   wraps at the next one: the minutes at 60, the hours at 24. A count that can pass an hour shows
 *   the hours, or the minutes drop the hour.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";
import { type TimePart } from "@zag-js/timer";

import { withContext } from "#timer/context.ts";
import { useTimer } from "#timer/machine.ts";

/**
 * Renders the `span` with the timer's item class.
 */
const Figured = withContext("span", "item");

/**
 * Describes the props of a part: the unit it renders and the props of a `span`, without children.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Figured>, "children"> {
  /**
   * Unit the part renders.
   */
  readonly type: TimePart;
}

/**
 * Renders a part with its figures and the machine's props merged under the caller's.
 *
 * @param props - The unit and the props of a `span`.
 * @returns The `span` element.
 */
export function Item({ type, ...props }: ItemProps): ReactElement {
  const { api } = useTimer();

  return (
    <Figured {...mergeProps(api.getItemProps({ type }), props)}>{api.formattedTime[type]}</Figured>
  );
}
