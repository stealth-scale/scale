/**
 * Renders the layer that dims the page behind a step.
 *
 * @remarks
 *   On a tooltip step the machine cuts the target's box out of the backdrop, so the target shows
 *   through undimmed and takes the pointer, and a press anywhere else on the backdrop dismisses the
 *   tour unless `closeOnInteractOutside` is false. The backdrop is as tall as the document then,
 *   because the machine places the cutout in the document's coordinates. On a dialog step it covers
 *   the window. A step with `backdrop: false`, a floating step by default, hides it. It fades in
 *   and out on its own presence. A caller renders it in a portal.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useBackdropPresence, useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's backdrop class.
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
  const api = useTourContext();
  const { props: presented, setNode, unmounted } = useBackdropPresence();

  if (unmounted) return null;

  const hidden = presented.hidden || api.step?.backdrop !== true;

  return (
    <Drawn {...mergeProps(api.getBackdropProps(), presented, { hidden }, props)} ref={setNode} />
  );
}
