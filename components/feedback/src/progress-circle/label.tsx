/**
 * Renders the words that name the ring.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the ring is named by it from then
 *   on. A ring without a label takes its name from `aria-label` on `ProgressCircle.Circle`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { withContext } from "#progress-circle/context.ts";
import { useProgress } from "#progress/machine.ts";
import { useLabelling } from "#progress/state.ts";

/**
 * Renders the label `span`.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of `Label`: the props of a `span`.
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
