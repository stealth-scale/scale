/**
 * Renders the tooltip's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which passes the recipe's variants to the trigger and the positioner and
 *   leaves the layout around the trigger unchanged. The root runs the content's presence: the
 *   content is not in the document until it first opens, and it leaves once its exit animation
 *   ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#tooltip/context.ts";
import {
  ApiProvider,
  PresenceProvider,
  splitTooltipProps,
  type TooltipOptions,
  useTooltipMachine,
} from "#tooltip/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the content's presence, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives the
 *   content's id from `id`, and reads `dir` for the placement. `lazyMount` and `unmountOnExit` are
 *   true by default.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Framed>, "dir" | "id">,
    Omit<PresenceOptions, "present">,
    TooltipOptions {}

/**
 * Renders the root and provides the machine's api and the content's presence to the parts.
 *
 * @param props - The machine's options, the content's presence, the recipe's variants and the
 *   props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitTooltipProps(props);
  const api = useTooltipMachine(options);
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
