/**
 * Shares whether the action bar is open, how it closes, and the presence of the bar with the parts.
 */

import { createRequiredContext, type Presence } from "@stealthscale/hooks";

/**
 * Describes what the root shares with the parts.
 */
export interface ActionBarState {
  /**
   * Asks the owner of the selection to close the bar, through `onOpenChange`.
   */
  readonly close: () => void;

  /**
   * Whether Escape inside the bar asks to close it.
   */
  readonly closeOnEscape: boolean;

  /**
   * Whether the bar is open.
   */
  readonly open: boolean;
}

/**
 * Creates the context through which the root shares its state with the parts.
 *
 * @remarks
 *   `useActionBar` throws when no `ActionBar.Root` is mounted above the calling part.
 */
export const [StateProvider, useActionBar] = createRequiredContext<ActionBarState>("ActionBar");

/**
 * Creates the context through which the root provides the bar's presence to the positioner and
 * the content.
 */
export const [PresenceProvider, useBarPresence] = createRequiredContext<Presence>("ActionBar");
