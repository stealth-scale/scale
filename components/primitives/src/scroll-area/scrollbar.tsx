/**
 * Renders the bar that shows and moves the scroll position along one axis.
 *
 * @remarks
 *   A press on the bar scrolls the viewport to the pointer, a drag of the thumb scrolls it along,
 *   and the wheel over the bar scrolls it. The bar shows only while its axis overflows. A keyboard
 *   and a screen reader scroll the viewport instead, so the bar has no role.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#scroll-area/context.ts";
import { useScrollArea } from "#scroll-area/machine.ts";
import { type Orientation, OrientationContext } from "#scroll-area/orientation.ts";
import { Thumb } from "#scroll-area/thumb.tsx";

/**
 * Renders the `div` with the scroll area's bar class.
 */
const Drawn = withContext("div", "scrollbar");

/**
 * Describes the props of a bar: its axis and the props of a `div`.
 */
export interface ScrollbarProps extends ComponentProps<typeof Drawn> {
  /**
   * Axis the bar scrolls, `vertical` unless the caller passes another.
   */
  readonly orientation?: Orientation | undefined;
}

/**
 * Renders the bar with the machine's props merged under the caller's, and a thumb when the caller
 * passes no children.
 *
 * @param props - The axis and the props of a `div`.
 * @returns The `div` element inside the orientation's provider.
 */
export function Scrollbar({
  children,
  orientation = "vertical",
  ...props
}: ScrollbarProps): ReactElement {
  const api = useScrollArea();

  return (
    <OrientationContext value={orientation}>
      <Drawn {...mergeProps(api.getScrollbarProps({ orientation }), props)}>
        {children ?? <Thumb />}
      </Drawn>
    </OrientationContext>
  );
}
