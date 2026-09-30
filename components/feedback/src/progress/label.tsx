/**
 * Renders the words that name the bar.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the track is named by it from
 *   then on. A bar without a label takes its name from `aria-label` on `Progress.Track`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";
import { useLabelling } from "#progress/state.ts";

/**
 * Renders the label `span`.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of `Label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's ID.
 *
 * @param props - The `span` element's props.
 * @returns The `span` element.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useProgress();
  const { setLabelled } = useLabelling();

  useSafeLayoutEffect(() => {
    setLabelled(true);

    return (): void => {
      setLabelled(false);
    };
  }, [setLabelled]);

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
