/**
 * Renders the ring around the element a step points at.
 *
 * @remarks
 *   The machine places the ring over the target's box, grown by `spotlightOffset` on each side, in
 *   the document's coordinates, with the corners of `spotlightRadius`. The ring takes no pointer
 *   events, and moves to the next target at the theme's `move` pace. A step without a target hides
 *   it. It fades in and out with the backdrop. A caller renders it in a portal.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useBackdropPresence, useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's spotlight class.
 */
const Drawn = withContext("div", "spotlight");

/**
 * Describes the props of the spotlight: the props of a `div`.
 */
export type SpotlightProps = ComponentProps<typeof Drawn>;

/**
 * Renders the spotlight with the machine's spotlight props and the backdrop's presence props merged
 * over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the backdrop is out of the document.
 */
export function Spotlight(props: SpotlightProps): null | ReactElement {
  const api = useTourContext();
  const { props: presented, unmounted } = useBackdropPresence();

  if (unmounted) return null;

  const target = api.step?.target?.() ?? null;
  const hidden = presented.hidden || target === null;

  return <Drawn {...mergeProps(api.getSpotlightProps(), presented, { hidden }, props)} />;
}
