/**
 * Builds the meters the part specifications render.
 */

import { type ReactElement } from "react";

import { Root, type RootProps } from "#meter/root.tsx";
import { Label } from "#progress/label.tsx";
import { Range } from "#progress/range.tsx";
import { Track } from "#progress/track.tsx";
import { ValueText } from "#progress/value-text.tsx";

/**
 * Label every labelled fixture shows.
 */
export const LABEL = "Storage used";

/**
 * Root props of a meter at 62 of 100.
 */
const MEASURED: RootProps = { value: 62 };

/**
 * Root props of a score of 3 out of 4.
 */
const SCORED: RootProps = { max: 4, value: 3 };

/**
 * Renders a meter with a label, the value in words and the track.
 *
 * @param props - The root's props.
 * @returns The meter.
 */
export function labelled(props: RootProps = MEASURED): ReactElement {
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
 * Renders a labelled meter whose track states the value in the caller's words.
 *
 * @param words - The `aria-valuetext` the track states.
 * @param props - The root's props.
 * @returns The meter.
 */
export function worded(words: string, props: RootProps = SCORED): ReactElement {
  return (
    <Root {...props}>
      <Label>{LABEL}</Label>
      <ValueText>{words}</ValueText>
      <Track aria-valuetext={words}>
        <Range />
      </Track>
    </Root>
  );
}

/**
 * Renders a meter with the track alone, named by `aria-label`.
 *
 * @param props - The root's props.
 * @returns The meter.
 */
export function bare(props: RootProps = MEASURED): ReactElement {
  return (
    <Root {...props}>
      <Track aria-label={LABEL}>
        <Range />
      </Track>
    </Root>
  );
}
