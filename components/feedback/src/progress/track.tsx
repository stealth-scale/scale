/**
 * Renders the track, which is the progress bar or the meter a screen reader reports.
 *
 * @remarks
 *   The machine writes the value range on the track and the `progressbar` role, which the track
 *   replaces with `meter` inside `Meter.Root`. A rendered label names the track through
 *   `aria-labelledby`. Without one, pass `aria-label`. The track states the formatted value as
 *   `aria-valuetext` while the value is known, so a screen reader reads `62%` or a count in the
 *   caller's units rather than the raw number. A caller replaces it with words through
 *   `aria-valuetext`, such as a password's strength or a target.
 */

import { type ComponentProps, type ReactElement, use } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";
import { RoleContext } from "#progress/role.ts";
import { useLabelling } from "#progress/state.ts";

/**
 * Renders the track `div`.
 */
const Tracked = withContext("div", "track");

/**
 * Describes the props of `Track`.
 */
export type TrackProps = ComponentProps<typeof Tracked>;

/**
 * Renders the track in its root's role, named by the label once it renders.
 *
 * @param props - The `div` element's props.
 * @returns The `div` element.
 */
export function Track(props: TrackProps): ReactElement {
  const api = useProgress();
  const role = use(RoleContext);
  const { id, labelled } = useLabelling();

  return (
    <Tracked
      {...mergeProps(
        api.getTrackProps(),
        {
          "aria-labelledby": labelled ? id : undefined,
          "aria-valuetext": api.indeterminate ? undefined : api.valueAsString,
          role,
        },
        props,
      )}
    />
  );
}
