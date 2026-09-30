/**
 * Renders one dot for every page of the carousel.
 *
 * @remarks
 *   The machine counts the pages from the slides, `slidesPerPage` and `slidesPerMove`, so the dots
 *   follow a change of either. The caller wraps them in `Carousel.IndicatorGroup`.
 */

import { type ReactElement } from "react";

import { Indicator } from "#carousel/indicator.tsx";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Describes the props of the dots: the words that name a dot.
 */
export interface IndicatorsProps {
  /**
   * Returns the accessible name of a dot from its page, counted from one. "Go to slide N" unless
   * the caller passes another function.
   */
  readonly label?: ((page: number) => string) | undefined;
}

/**
 * Renders the dots.
 *
 * @param props - The function that returns a dot's accessible name.
 * @returns A dot per page, in order.
 */
export function Indicators({ label }: IndicatorsProps): ReactElement {
  const { api } = useCarousel();

  return (
    <>
      {api.pageSnapPoints.map((point, index) => (
        <Indicator index={index} key={point} label={label?.(index + 1)} />
      ))}
    </>
  );
}
