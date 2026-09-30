/**
 * Renders the glyph inside the toggle for the current visibility.
 *
 * @remarks
 *   The indicator renders its children while the value is shown and `fallback` while it is hidden,
 *   such as a crossed-out eye and an eye, with no element of its own, so the toggle centres the
 *   glyph. The toggle's name states the visibility, so the glyph adds nothing to it.
 */

import { type ReactNode } from "react";

import { usePasswordInput } from "#password-input/machine.ts";

/**
 * Describes the props of the indicator: a glyph for each visibility.
 */
export interface IndicatorProps {
  /**
   * Content while the value is shown.
   */
  readonly children?: ReactNode;

  /**
   * Content while the value is hidden.
   */
  readonly fallback?: ReactNode;
}

/**
 * Renders the glyph for the current visibility.
 *
 * @param props - The glyph for each visibility.
 * @returns The glyph, with no wrapper.
 */
export function Indicator({ children, fallback }: IndicatorProps): ReactNode {
  const api = usePasswordInput();

  return api.visible ? children : fallback;
}
