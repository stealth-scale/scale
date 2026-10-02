/**
 * Renders the hover card's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `span` with
 *   `display: contents`, which passes the recipe's variants to the triggers and the positioner and
 *   leaves the layout around a trigger unchanged. A `span` is phrasing content, so a card can open
 *   from a link inside a paragraph. The HTML parser closes a paragraph before a `div`. The root
 *   runs the panel's presence: the panel is not in the document until it first opens, and it leaves
 *   once its exit animation ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#hover-card/context.ts";
import {
  ApiProvider,
  type HoverCardOptions,
  PresenceProvider,
  splitHoverCardProps,
  useHoverCardMachine,
} from "#hover-card/machine.ts";

/**
 * Renders the `span` that provides the recipe's variants.
 */
const Framed = withProvider("span", "root");

/**
 * Describes the props of the root: the machine's options, the panel's presence, the recipe's
 * variants and the props of a `span`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives every
 *   part's id from `id`, and reads `dir` for the placement. `lazyMount` and `unmountOnExit` are
 *   true by default.
 */
export interface RootProps
  extends
    HoverCardOptions,
    Omit<ComponentProps<typeof Framed>, "dir" | "id">,
    Omit<PresenceOptions, "present"> {}

/**
 * Renders the root and provides the machine's api and the panel's presence to the parts.
 *
 * @param props - The machine's options, the panel's presence, the recipe's variants and the props
 *   of a `span`.
 * @returns The `span` element inside the providers.
 */
export function Root({
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitHoverCardProps(props);
  const api = useHoverCardMachine(options);
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
