/**
 * Renders the action bar's root, runs the bar's presence and announces the bar as it opens.
 *
 * @remarks
 *   The caller keeps the selection, so the root takes `open`, true while anything is selected, and
 *   asks to close through `onOpenChange` on Escape and on a press of the close trigger. The root
 *   renders a `div` with `display: contents`, which passes the recipe's variants to the positioner
 *   and leaves the layout around it unchanged. The bar is not in the document before it first
 *   opens, and leaves once its exit animation ends. Focus remains on the selection when the bar
 *   opens, so a screen reader hears `announcement` each time it does.
 */

import { type ComponentProps, type ReactElement, useEffect } from "react";

import { type PresenceOptions, useAnnounce, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#action-bar/context.ts";
import { type ActionBarState, PresenceProvider, StateProvider } from "#action-bar/state.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the details `onOpenChange` receives.
 */
export interface OpenChangeDetails {
  /**
   * Whether the bar asks to be open, false for Escape and the close trigger.
   */
  readonly open: boolean;
}

/**
 * Describes the props of the root: whether the bar is open, how it asks to close, its announcement,
 * the presence options, the recipe's variants and the props of a `div`.
 *
 * @remarks
 *   `lazyMount` and `unmountOnExit` are true by default.
 */
export interface RootProps extends ComponentProps<typeof Framed>, Omit<PresenceOptions, "present"> {
  /**
   * Words a screen reader hears as the bar opens. Defaults to `Actions available`.
   */
  readonly announcement?: string | undefined;

  /**
   * Whether Escape inside the bar asks to close it. True by default.
   */
  readonly closeOnEscape?: boolean | undefined;

  /**
   * Called when the bar asks to close. The caller clears the selection, which closes the bar.
   */
  readonly onOpenChange?: ((details: OpenChangeDetails) => void) | undefined;

  /**
   * Whether the bar is open, usually while anything is selected.
   */
  readonly open: boolean;
}

/**
 * Renders the root and provides the bar's state and presence to the parts.
 *
 * @param props - Whether the bar is open, how it asks to close, its announcement, the presence
 *   options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({
  announcement = "Actions available",
  closeOnEscape = true,
  lazyMount = true,
  onExitComplete,
  onOpenChange,
  open,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: open,
    skipAnimationOnMount,
    unmountOnExit,
  });
  const announce = useAnnounce();
  const state: ActionBarState = {
    close: () => {
      onOpenChange?.({ open: false });
    },
    closeOnEscape,
    open,
  };

  useEffect(() => {
    if (open) announce(announcement);
  }, [announce, announcement, open]);

  return (
    <StateProvider value={state}>
      <PresenceProvider value={presence}>
        <Framed {...props} />
      </PresenceProvider>
    </StateProvider>
  );
}
