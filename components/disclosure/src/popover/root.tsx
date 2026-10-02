/**
 * Renders the popover's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which passes the recipe's variants to the trigger and the positioner and
 *   leaves the layout around the trigger unchanged. The root runs the panel's presence: the panel
 *   is not in the document until it first opens, and it leaves once its exit animation ends. The
 *   root records whether a title and a description are mounted, which the content names the panel
 *   by.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#popover/context.ts";
import {
  ApiProvider,
  DescriptionLabelling,
  NamingProvider,
  type PopoverOptions,
  PresenceProvider,
  splitPopoverProps,
  TitleLabelling,
  usePopoverMachine,
} from "#popover/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the panel's presence, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives every
 *   part's id from `id`, and reads `dir` for the placement. `lazyMount` and `unmountOnExit` are
 *   true by default.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Framed>, "dir" | "id">,
    Omit<PresenceOptions, "present">,
    PopoverOptions {}

/**
 * Renders the root and provides the machine's api and the panel's presence to the parts.
 *
 * @param props - The machine's options, the panel's presence, the recipe's variants and the props
 *   of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitPopoverProps(props);
  const api = usePopoverMachine(options);
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });
  const [titled, setTitled] = useState(false);
  const [described, setDescribed] = useState(false);

  return (
    <ApiProvider value={api}>
      <PresenceProvider value={presence}>
        <TitleLabelling value={setTitled}>
          <DescriptionLabelling value={setDescribed}>
            <NamingProvider value={{ described, titled }}>
              <Framed {...rest} />
            </NamingProvider>
          </DescriptionLabelling>
        </TitleLabelling>
      </PresenceProvider>
    </ApiProvider>
  );
}
