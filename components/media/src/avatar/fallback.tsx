/**
 * Renders what the avatar shows while its picture is missing, loading or broken.
 *
 * @remarks
 *   Without children the fallback shows the initials of the root's `name`: the first letter of the
 *   first word and of the last. Pass an icon to an avatar without a name, or a count such as `+3`
 *   to the last avatar of a group. The machine hides the fallback once the picture loads.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#avatar/context.ts";
import { initialsOf } from "#avatar/initials.ts";
import { useAvatar } from "#avatar/machine.ts";
import { useAvatarName } from "#avatar/state.ts";

/**
 * Renders the fallback `span`.
 */
const Lettered = withContext("span", "fallback");

/**
 * Describes the props of `Fallback`.
 */
export type FallbackProps = ComponentProps<typeof Lettered>;

/**
 * Renders the children, or the initials of the root's name.
 *
 * @param props - The `span` element's props.
 * @returns The `span` element, hidden once the picture loads.
 */
export function Fallback({ children, ...rest }: FallbackProps): ReactElement {
  const api = useAvatar();
  const name = useAvatarName();

  return (
    <Lettered {...mergeProps(api.getFallbackProps(), rest)}>
      {children ?? initialsOf(name ?? "")}
    </Lettered>
  );
}
