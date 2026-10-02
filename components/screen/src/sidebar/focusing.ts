/**
 * Moves focus to a sidebar search's field, opening the sidebar's panel first while the field is out
 * of reach.
 *
 * @remarks
 *   A rail renders no field, and a closed panel hides its field. In both cases the function opens
 *   the panel and records the request. Once the field is in reach, a layout effect moves focus to
 *   it, before the shell moves focus into a panel over the page. The shell leaves focus that is
 *   already inside the panel where it is.
 */

import { type RefObject, useRef } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Returns a function that moves focus to the field inside an element.
 *
 * @param field - The element around the field, empty on a rail.
 * @param reachable - Whether the field is rendered and shown: the sidebar is no rail and its panel
 *   is open.
 * @param expand - Opens the sidebar's panel.
 * @returns The function, which the search's button and its shortcut call.
 */
export function useFocusing(
  field: RefObject<HTMLElement | null>,
  reachable: boolean,
  expand: () => void,
): () => void {
  const wanted = useRef(false);

  useSafeLayoutEffect(() => {
    if (!wanted.current || !reachable) return;

    wanted.current = false;
    field.current?.querySelector("input")?.focus();
  });

  return (): void => {
    const input = field.current?.querySelector("input");

    if (reachable && input !== null && input !== undefined) {
      input.focus();

      return;
    }

    wanted.current = true;
    expand();
  };
}
