/**
 * Renders the timer's root and starts the machine its parts share.
 *
 * @remarks
 *   The root is a `div` around the count and the buttons. It passes its `size` and `palette` to
 *   every library `Button` inside it, so the action triggers match the count.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ButtonPropsProvider } from "@stealthscale/component-actions";
import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#timer/context.ts";
import {
  MachineProvider,
  splitTimerProps,
  type TimerOptions,
  useTimerMachine,
} from "#timer/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's `id` is left out, because the machine takes it.
 */
export interface RootProps extends Omit<ComponentProps<typeof Framed>, "id">, TimerOptions {}

/**
 * Renders the root inside the provider of the running machine and the provider of the buttons'
 * size and palette.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({ palette, size, ...props }: RootProps): ReactElement {
  const [options, rest] = splitTimerProps(props);
  const machine = useTimerMachine(options);

  return (
    <MachineProvider value={machine}>
      <ButtonPropsProvider value={omitUndefined({ palette, size })}>
        <Framed
          {...mergeProps(machine.api.getRootProps(), rest)}
          {...omitUndefined({ palette, size })}
        />
      </ButtonPropsProvider>
    </MachineProvider>
  );
}
