/**
 * Renders the layer that dims the page behind the drawer.
 *
 * @remarks
 *   The backdrop covers the window under the positioner and takes pointer events, so a press on it
 *   reaches no control on the page and closes the drawer, unless `closeOnInteractOutside` is false.
 *   It fades in and out on its own presence, and renders nothing while the drawer is closed and its
 *   exit animation has ended. A caller who renders the drawer outside a clipping or stacking
 *   ancestor wraps this part in a portal.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useBackdropPresence, useDrawer } from "#drawer/machine.ts";

/**
 * Renders the `div` with the drawer's backdrop class.
 */
const Drawn = withContext("div", "backdrop");

/**
 * Describes the props of the backdrop: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type BackdropProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the backdrop with the machine's backdrop props and its presence props merged over the
 * caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the backdrop is out of the document.
 */
export function Backdrop(props: BackdropProps): null | ReactElement {
  const api = useDrawer();
  const { props: presented, setNode, unmounted } = useBackdropPresence();

  if (unmounted) return null;

  return <Drawn {...mergeProps(api.getBackdropProps(), presented, props)} ref={setNode} />;
}
