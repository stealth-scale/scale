/**
 * Builds the rings the part specifications render.
 */

import { type ReactElement } from "react";

import { Circle } from "#progress-circle/circle.tsx";
import { Label } from "#progress-circle/label.tsx";
import { Range } from "#progress-circle/range.tsx";
import { Root, type RootProps } from "#progress-circle/root.tsx";
import { Track } from "#progress-circle/track.tsx";
import { ValueText } from "#progress-circle/value-text.tsx";

/**
 * Label every labelled fixture shows.
 */
export const LABEL = "Uploading the report";

/**
 * Renders a ring with its circles, the value in its middle and a label.
 *
 * @param props - The root's props.
 * @returns The ring.
 */
export function labelled(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Circle>
        <Track />
        <Range />
      </Circle>
      <ValueText />
      <Label>{LABEL}</Label>
    </Root>
  );
}

/**
 * Renders a ring alone, named by `aria-label`.
 *
 * @param props - The root's props.
 * @returns The ring.
 */
export function bare(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Circle aria-label={LABEL}>
        <Track />
        <Range />
      </Circle>
    </Root>
  );
}
