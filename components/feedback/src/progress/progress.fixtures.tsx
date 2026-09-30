/**
 * Builds the bars the part specifications render.
 */

import { type ReactElement } from "react";

import { Label } from "#progress/label.tsx";
import { Marker } from "#progress/marker.tsx";
import { Range } from "#progress/range.tsx";
import { Root, type RootProps } from "#progress/root.tsx";
import { Segment, type SegmentColor } from "#progress/segment.tsx";
import { Track } from "#progress/track.tsx";
import { ValueText } from "#progress/value-text.tsx";

/**
 * Label every labelled fixture shows.
 */
export const LABEL = "Reconciling payouts";

/**
 * Describes one segment a fixture renders: its key, its value and its color.
 */
export interface Part {
  /**
   * Color the segment states, if any.
   */
  readonly color?: SegmentColor | undefined;

  /**
   * Key of the segment among its siblings.
   */
  readonly key: string;

  /**
   * Amount the segment stands for.
   */
  readonly value: number;
}

/**
 * Renders a bar with a label, the value in words and the track.
 *
 * @param props - The root's props.
 * @returns The bar.
 */
export function labelled(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Label>{LABEL}</Label>
      <ValueText />
      <Track>
        <Range />
      </Track>
    </Root>
  );
}

/**
 * Renders a bar with the track alone, named by `aria-label`.
 *
 * @param props - The root's props.
 * @returns The bar.
 */
export function bare(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Track aria-label={LABEL}>
        <Range />
      </Track>
    </Root>
  );
}

/**
 * Renders a labelled bar with a marker at a value on its track.
 *
 * @param value - The value the marker is placed at.
 * @param props - The root's props.
 * @returns The bar.
 */
export function marked(value: number, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Label>{LABEL}</Label>
      <Track>
        <Range />
        <Marker value={value} />
      </Track>
    </Root>
  );
}

/**
 * Renders a labelled bar whose track is filled by a segment per part.
 *
 * @param parts - The segments' keys, values and colors.
 * @param props - The root's props.
 * @returns The bar.
 */
export function segmented(parts: readonly Part[], props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Label>{LABEL}</Label>
      <Track>
        {parts.map(({ color, key, value }) => (
          <Segment color={color} key={key} value={value} />
        ))}
      </Track>
    </Root>
  );
}
