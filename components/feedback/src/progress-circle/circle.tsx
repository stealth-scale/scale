/**
 * Renders the ring, which is the progress bar a screen reader reports.
 *
 * @remarks
 *   The element is an `svg` the machine gives the `progressbar` role, the value range and a width
 *   and height of `--size`. A rendered `ProgressCircle.Label` names it through `aria-labelledby`.
 *   Without one, pass `aria-label`. The ring states the formatted value as `aria-valuetext` while
 *   the value is known, so a screen reader reads `62%` or a count in the caller's units.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress-circle/context.ts";
import { useProgress } from "#progress/machine.ts";
import { useLabelling } from "#progress/state.ts";

/**
 * Renders the ring `svg`.
 */
const Ring = withContext("svg", "circle");

/**
 * Describes the props of `Circle`: the props of an `svg`.
 */
export type CircleProps = ComponentProps<typeof Ring>;

/**
 * Renders the ring with the machine's progress bar props, named by the label once it renders.
 *
 * @param props - The `svg` element's props and its circles.
 * @returns The `svg` element.
 */
export function Circle(props: CircleProps): ReactElement {
  const api = useProgress();
  const { id, labelled } = useLabelling();

  return (
    <Ring
      {...mergeProps(
        api.getCircleProps(),
        {
          "aria-labelledby": labelled ? id : undefined,
          "aria-valuetext": api.indeterminate ? undefined : api.valueAsString,
        },
        props,
      )}
    />
  );
}
