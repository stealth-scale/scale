/**
 * Carries the look a container sets for every sample inside it, so a board or a matrix states how
 * its cells are drawn once rather than on each of them.
 *
 * @remarks
 *   A React context rather than the binding's own provider, because a slot recipe binds no props
 *   provider: the compiler's factories offer one for a recipe that draws a single element, and a
 *   sample draws three. A sample's own props win over what the container set, so one cell of a
 *   board is boxed while the rest are plain by writing the look on that cell.
 */

import { createContext, useContext } from "react";

import { type RootProps } from "#sample/parts.ts";

/**
 * Describes what a container sets for the samples below it: how each box is drawn, and where the
 * drawing sits in it.
 *
 * @remarks
 *   Each axis is read off the sample's own props rather than written out again, so a value added
 *   to the recipe reaches a board and a matrix without this file changing.
 */
export interface Display {
  /**
   * Where the drawing sits in its box.
   */
  place?: RootProps["place"];

  /**
   * How the box round the drawing is drawn.
   */
  variant?: RootProps["variant"];
}

/**
 * Carries the look the nearest container set down to every sample under it, and carries nothing
 * outside a container.
 */
const Held = createContext<Display>({});

/**
 * Sets the look of every sample below it.
 */
export const DisplayProvider = Held.Provider;

/**
 * Reads what the nearest container set, with what a sample states itself winning over it.
 *
 * @remarks
 *   A prop left out reads as absent rather than as a value, so a sample that states neither axis
 *   takes both from the container and a sample that states one takes the other.
 */
export function useDisplay({ place, variant }: Display): Display {
  const held = useContext(Held);

  return {
    place: place ?? held.place,
    variant: variant ?? held.variant,
  };
}
