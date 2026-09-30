/**
 * Renders the drawer's root and starts the dialog machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which passes the recipe's variants to the trigger, the backdrop and the
 *   positioner and leaves the layout around the trigger unchanged. The root runs two presences, one
 *   for the panel and one for the backdrop: neither is in the document until the drawer first
 *   opens, and each leaves once its own exit animation ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { type DialogOptions, splitDialogProps, useDialogMachine } from "#dialog/machine.ts";
import { withProvider } from "#drawer/context.ts";
import { ApiProvider, BackdropProvider, PanelProvider } from "#drawer/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the dialog machine's options, the presence of the panel and the
 * backdrop, the recipe's variants and the props of a `div`.
 *
 * @remarks
 *   The element's `id`, `dir`, `role` and `aria-label` are left out, because the machine takes all
 *   four. `lazyMount` and `unmountOnExit` are true by default.
 */
export interface RootProps
  extends
    DialogOptions,
    Omit<ComponentProps<typeof Framed>, "aria-label" | "dir" | "id" | "role">,
    Omit<PresenceOptions, "present"> {}

/**
 * Renders the root and provides the machine's api and both presences to the parts.
 *
 * @param props - The machine's options, the presence options, the recipe's variants and the props
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
  const [options, rest] = splitDialogProps(props);
  const api = useDialogMachine(options);
  const shown = { lazyMount, present: api.open, skipAnimationOnMount, unmountOnExit };
  const panel = usePresence({ ...shown, onExitComplete });
  const backdrop = usePresence(shown);

  return (
    <ApiProvider value={api}>
      <PanelProvider value={panel}>
        <BackdropProvider value={backdrop}>
          <Framed {...rest} />
        </BackdropProvider>
      </PanelProvider>
    </ApiProvider>
  );
}
