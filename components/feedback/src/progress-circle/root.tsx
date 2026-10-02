/**
 * Renders the ring's grid and runs the machine that tracks its value.
 *
 * @remarks
 *   The root is a `div` without a role. The `svg` inside it is the progress bar. `value` sets the
 *   value between `min` and `max`, 0 and 100 by default, and `null` renders a ring whose value is
 *   not known. Without `value` or `defaultValue` the machine starts halfway. The ring runs the
 *   progress bar's machine and names itself the same way.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { withProvider } from "#progress-circle/context.ts";
import {
  ApiProvider,
  type ProgressOptions,
  splitProgressProps,
  useProgressMachine,
} from "#progress/machine.ts";
import { LabellingProvider } from "#progress/state.ts";

/**
 * Renders the root `div` and provides the variants to the parts.
 */
const Gridded = withProvider("div", "root");

/**
 * Describes the props of `Root`: the machine settings, the variants and the `div` props.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Gridded>, "defaultValue" | "dir" | "id">, ProgressOptions {}

/**
 * Renders the ring's grid and provides the machine's API and the label's state to its parts.
 *
 * @param props - The machine settings, the recipe's variants and the `div` props.
 * @returns The `div` element.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitProgressProps(props);
  const { api, labelId } = useProgressMachine(options);
  const [labelled, setLabelled] = useState(false);

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={{ id: labelId, labelled, setLabelled }}>
        <Gridded {...rest} {...api.getRootProps()} />
      </LabellingProvider>
    </ApiProvider>
  );
}
