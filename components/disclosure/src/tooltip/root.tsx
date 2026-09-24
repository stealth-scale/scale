/**
 * Renders the tooltip's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which passes the recipe's variants to the trigger and the positioner and
 *   leaves the layout around the trigger unchanged.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#tooltip/context.ts";
import {
  ApiProvider,
  splitTooltipProps,
  type TooltipOptions,
  useTooltipMachine,
} from "#tooltip/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives the
 *   content's id from `id`, and reads `dir` for the placement.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id">, TooltipOptions {}

/**
 * Renders the root and provides the machine's api to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the api provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitTooltipProps(props);
  const api = useTooltipMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} />
    </ApiProvider>
  );
}
