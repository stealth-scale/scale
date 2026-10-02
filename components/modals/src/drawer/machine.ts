/**
 * Creates the contexts through which the drawer's root provides the dialog machine's api and the
 * presence of its panel and backdrop to the parts.
 *
 * @remarks
 *   A drawer is a dialog attached to an edge of the window, so it runs the dialog machine through
 *   `useDialogMachine`. The contexts are the drawer's own, so a part rendered outside a root names
 *   the drawer in its error.
 */

import { createRequiredContext, type Presence } from "@stealthscale/hooks";

import { type DialogApi } from "#dialog/machine.ts";

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useDrawer` throws when no `Drawer.Root` is mounted above the calling part.
 */
export const [ApiProvider, useDrawer] = createRequiredContext<DialogApi>("Drawer");

/**
 * Creates the context through which the root provides the panel's presence to the positioner and
 * the content.
 */
export const [PanelProvider, usePanelPresence] = createRequiredContext<Presence>("Drawer");

/**
 * Creates the context through which the root provides the backdrop's presence to the backdrop.
 */
export const [BackdropProvider, useBackdropPresence] = createRequiredContext<Presence>("Drawer");
