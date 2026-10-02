/**
 * Creates the contexts through which the toggle tip's root provides the popover machine's api and
 * the tip's presence to its parts.
 *
 * @remarks
 *   The toggle tip runs the popover machine through `usePopoverMachine`. Its parts read contexts of
 *   their own, so a part rendered outside a toggle tip names ToggleTip in its error.
 */

import { createRequiredContext, type Presence } from "@stealthscale/hooks";

import { type PopoverApi } from "#popover/machine.ts";

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useToggleTip` throws when no `ToggleTip.Root` is mounted above the calling part.
 */
export const [ApiProvider, useToggleTip] = createRequiredContext<PopoverApi>("ToggleTip");

/**
 * Creates the context through which the root provides the tip's presence to the positioner and
 * the content.
 */
export const [PresenceProvider, useTipPresence] = createRequiredContext<Presence>("ToggleTip");
