/**
 * Renders the toggle tip's root and starts the popover machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `span` with
 *   `display: contents`, which passes the recipe's variants to the trigger and the positioner and
 *   leaves the layout around the trigger unchanged. A `span` is phrasing content, so the root is
 *   valid inside a table cell or a heading. `autoFocus` is false by default, so the trigger keeps
 *   focus while the tip opens. The root runs the tip's presence: the tip is not in the
 *   document until it first opens, and it leaves once its exit animation ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { type PopoverOptions, splitPopoverProps, usePopoverMachine } from "#popover/machine.ts";
import { withProvider } from "#toggle-tip/context.ts";
import { ApiProvider, PresenceProvider } from "#toggle-tip/machine.ts";

/**
 * Renders the `span` that provides the recipe's variants.
 */
const Framed = withProvider("span", "root");

/**
 * Describes the props of the root: the popover machine's options, the tip's presence, the recipe's
 * variants and the props of a `span`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives every
 *   part's id from `id`, and reads `dir` for the placement. `autoFocus` is false and `lazyMount`
 *   and `unmountOnExit` are true by default.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Framed>, "dir" | "id">,
    Omit<PresenceOptions, "present">,
    PopoverOptions {}

/**
 * Renders the root and provides the machine's api and the tip's presence to the parts.
 *
 * @param props - The machine's options, the tip's presence, the recipe's variants and the props of
 *   a `span`.
 * @returns The `span` element inside the providers.
 */
export function Root({
  autoFocus = false,
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitPopoverProps(props);
  const api = usePopoverMachine({ ...options, autoFocus });
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });

  return (
    <ApiProvider value={api}>
      <PresenceProvider value={presence}>
        <Framed {...rest} />
      </PresenceProvider>
    </ApiProvider>
  );
}
