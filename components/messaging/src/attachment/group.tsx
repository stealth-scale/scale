/**
 * Renders a list of attachments.
 *
 * @remarks
 *   The element is a `ul`, and every `Attachment.Root` inside it renders an `li`, so a screen
 *   reader announces the number of files. `size` and `orientation` are the defaults of the
 *   attachments inside, and `orientation` also lays them out: rows stack, and tiles wrap. Name the
 *   list with `aria-label`, such as "Attachments".
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#attachment/context.ts";
import { GroupProvider } from "#attachment/state.ts";

/**
 * Renders the `ul` with the attachment's group class.
 */
const Listed = withProvider("ul", "group");

/**
 * Describes the props of the group: the size and orientation of its attachments, and the props of
 * a `ul`.
 */
export type GroupProps = ComponentProps<typeof Listed>;

/**
 * Renders the list and provides its size and orientation to the attachments inside.
 *
 * @param props - The size and orientation of the attachments, and the props of a `ul`.
 * @returns The `ul` element inside the provider.
 */
export function Group(props: GroupProps): ReactElement {
  const { orientation, size } = props;

  return (
    <GroupProvider value={omitUndefined({ orientation, size })}>
      <Listed {...props} />
    </GroupProvider>
  );
}
