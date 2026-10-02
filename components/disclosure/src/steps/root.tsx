/**
 * Renders the steps' root and starts the machine its parts share.
 *
 * @remarks
 *   The element is a `div` without a role. The machine sets `--percent`, the share of the steps
 *   completed, as a custom property on it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#steps/context.ts";
import {
  MachineProvider,
  splitStepsProps,
  type StepsOptions,
  useStepsMachine,
} from "#steps/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   The element's `dir` and `id` are left out, because the machine takes both.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id">, StepsOptions {}

/**
 * Renders the root and provides the running machine to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the machine's provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitStepsProps(props);
  const machine = useStepsMachine(options);

  return (
    <MachineProvider value={machine}>
      <Framed {...mergeProps(machine.api.getRootProps(), rest)} />
    </MachineProvider>
  );
}
