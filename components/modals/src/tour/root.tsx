/**
 * Renders the tour's root and provides the api `useTour` returns to the parts.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which passes the recipe's variants to the portalled backdrop, spotlight
 *   and positioner and leaves the layout around it unchanged. The root runs two presences, one for
 *   the card and one for the backdrop and the spotlight: neither is in the document until the tour
 *   first opens, and each leaves once its own exit animation ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#tour/context.ts";
import { ApiProvider, BackdropProvider, PanelProvider, type TourApi } from "#tour/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the api, the presence of the card and the backdrop, the
 * recipe's variants and the props of a `div`.
 *
 * @remarks
 *   `lazyMount` and `unmountOnExit` are true by default.
 */
export interface RootProps extends ComponentProps<typeof Framed>, Omit<PresenceOptions, "present"> {
  /**
   * The api `useTour` returns, which every part reads.
   */
  readonly tour: TourApi;
}

/**
 * Renders the root and provides the api and both presences to the parts.
 *
 * @param props - The api, the presence options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  tour,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const shown = { lazyMount, present: tour.open, skipAnimationOnMount, unmountOnExit };
  const panel = usePresence({ ...shown, onExitComplete });
  const backdrop = usePresence(shown);

  return (
    <ApiProvider value={tour}>
      <PanelProvider value={panel}>
        <BackdropProvider value={backdrop}>
          <Framed {...props} />
        </BackdropProvider>
      </PanelProvider>
    </ApiProvider>
  );
}
