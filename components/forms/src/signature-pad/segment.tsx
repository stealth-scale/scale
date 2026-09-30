/**
 * Renders the strokes of a signature.
 *
 * @remarks
 *   The element is an `svg` over the whole control, hidden from assistive technology, with one
 *   `path` per committed stroke and one for the stroke being drawn. Each path is a filled outline,
 *   so the ink is the `svg`'s fill: the palette's solid color from the recipe, or the color the
 *   caller states in `drawing.fill`. That color is set inline, because the machine renders an image
 *   from a copy of the `svg` that keeps inline styles alone. The machine's inline layout styles are
 *   left out, and the recipe places the element.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#signature-pad/context.ts";
import { useSignaturePad } from "#signature-pad/machine.ts";
import { useShared } from "#signature-pad/state.ts";

/**
 * Renders the `svg` with the signature pad's segment class.
 */
const Stroked = withContext("svg", "segment");

/**
 * Describes the props of the segment: the props of an `svg`.
 */
export type SegmentProps = ComponentProps<typeof Stroked>;

/**
 * Renders the `svg` and a `path` per stroke.
 *
 * @param props - Attributes of the `svg` element, merged over the machine's.
 * @returns The `svg` element.
 */
export function Segment(props: SegmentProps): ReactElement {
  const api = useSignaturePad();
  const { ink } = useShared();
  const { style: _style, ...segment } = api.getSegmentProps();

  return (
    <Stroked
      aria-hidden
      {...mergeProps(segment, ink === undefined ? {} : { style: { fill: ink } }, props)}
    >
      {api.paths.map((path, index) => (
        // eslint-disable-next-line react/no-array-index-key -- strokes are appended and removed from the end, so an index names one stroke
        <path key={index} {...api.getSegmentPathProps({ path })} />
      ))}
      {api.currentPath === null ? null : (
        <path {...api.getSegmentPathProps({ path: api.currentPath })} />
      )}
    </Stroked>
  );
}
