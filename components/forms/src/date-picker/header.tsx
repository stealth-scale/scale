/**
 * Renders a view's header: the previous trigger, the view trigger with the range text, and the
 * next trigger.
 *
 * @remarks
 *   The glyphs of the previous and the next trigger are the caller's. Their names and the view
 *   trigger's words default by the view, "Previous month" and "Next month" in the day view.
 */

import { type ReactElement, type ReactNode } from "react";

import { NextTrigger } from "#date-picker/next-trigger.tsx";
import { PrevTrigger } from "#date-picker/prev-trigger.tsx";
import { RangeText } from "#date-picker/range-text.tsx";
import { ViewControl, type ViewControlProps } from "#date-picker/view-control.tsx";
import { ViewTrigger } from "#date-picker/view-trigger.tsx";

/**
 * Describes the props of the header: the glyphs and the names of its triggers and the props of a
 * `div`.
 */
export interface HeaderProps extends Omit<ViewControlProps, "children"> {
  /**
   * Glyph of the next trigger.
   */
  readonly nextIcon: ReactNode;

  /**
   * Accessible name of the next trigger, by default by the view.
   */
  readonly nextLabel?: string | undefined;

  /**
   * Glyph of the previous trigger.
   */
  readonly previousIcon: ReactNode;

  /**
   * Accessible name of the previous trigger, by default by the view.
   */
  readonly previousLabel?: string | undefined;

  /**
   * Words after the range text in the view trigger's name, by default by the view.
   */
  readonly viewLabel?: string | undefined;
}

/**
 * Renders the header row of the view it is in.
 *
 * @param props - The glyphs, the names and the props of a `div`.
 * @returns The `div` element with the three triggers.
 */
export function Header({
  nextIcon,
  nextLabel,
  previousIcon,
  previousLabel,
  viewLabel,
  ...props
}: HeaderProps): ReactElement {
  return (
    <ViewControl {...props}>
      <PrevTrigger label={previousLabel}>{previousIcon}</PrevTrigger>
      <ViewTrigger label={viewLabel}>
        <RangeText />
      </ViewTrigger>
      <NextTrigger label={nextLabel}>{nextIcon}</NextTrigger>
    </ViewControl>
  );
}
