/**
 * Renders the meter's root: the progress bar's root, with the track in the `meter` role.
 *
 * @remarks
 *   A meter is the progress bar's parts over the same machine, as React Aria's meter is its
 *   progress bar with another role. `value` is required, because a meter measures a value it has: a
 *   value the machine does not know belongs to a progress bar. A meter changes nothing itself, so
 *   it takes no `defaultValue` or `onValueChange`. It shows no work under way, so it offers no
 *   stripes, no moving stripes and no effect.
 */

import { type ReactElement } from "react";

import { RoleContext } from "#progress/role.ts";
import { Root as Bar, type RootProps as BarProps } from "#progress/root.tsx";

/**
 * Describes the props of the root: the progress bar's props without those of work under way, and
 * the measured value.
 *
 * @remarks
 *   `min` is 0 and `max` 100 by default, and `formatOptions` formats the value as a percent unless
 *   it states another style.
 */
export interface RootProps extends Omit<
  BarProps,
  "animated" | "defaultValue" | "effect" | "onValueChange" | "striped" | "value"
> {
  /**
   * The measured value, between `min` and `max`.
   */
  readonly value: number;
}

/**
 * Renders the progress bar's root inside the meter's role.
 *
 * @param props - The value, its range and format, the recipe's variants and the props of a `div`.
 * @returns The root `div` inside the role's provider.
 */
export function Root(props: RootProps): ReactElement {
  return (
    <RoleContext value="meter">
      <Bar {...props} />
    </RoleContext>
  );
}
