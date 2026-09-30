/**
 * Renders a row of avatars that overlap, each ringed in the panel's ground.
 *
 * @remarks
 *   The group gives its `palette`, `shape`, `size` and `variant` to every avatar in it that states
 *   none. Each avatar overlaps the one before it by a quarter of its side, and a later avatar is
 *   drawn over an earlier one. Show the people left out as a last avatar with a count, such as
 *   `+3`, named by `name`, such as `3 more`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#avatar/context.ts";
import { DefaultsContext } from "#avatar/state.ts";

/**
 * Renders the group `span`.
 */
const Grouped = withProvider("span", "group");

/**
 * Describes the props of `Group`: the variants its avatars default to and the `span` props.
 */
export type GroupProps = ComponentProps<typeof Grouped>;

/**
 * Renders the row and provides its variants to the avatars in it.
 *
 * @param props - The variants and the `span` element's props.
 * @returns The `span` element.
 */
export function Group({ palette, shape, size, variant, ...rest }: GroupProps): ReactElement {
  return (
    <DefaultsContext value={omitUndefined({ palette, shape, size, variant })}>
      <Grouped {...rest} />
    </DefaultsContext>
  );
}
