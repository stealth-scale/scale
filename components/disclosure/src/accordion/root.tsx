/**
 * Renders the accordion's root and starts the machine its items share.
 *
 * @remarks
 *   The element is a `div` without a role. Each trigger is a button inside a heading and each
 *   content a region, and a role on the root would announce a widget that does not exist.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#accordion/context.ts";
import {
  type AccordionOptions,
  MachineProvider,
  splitAccordionProps,
  useAccordionMachine,
} from "#accordion/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   `orientation` is left out, because the recipe lays the items out in a column. The element's
 *   `defaultValue`, `dir` and `id` are left out, because the machine takes all three.
 */
export interface RootProps
  extends
    Omit<AccordionOptions, "orientation">,
    Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id"> {}

/**
 * Renders the root and provides the running machine to the items.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the machine's provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitAccordionProps(props);
  const machine = useAccordionMachine(options);

  return (
    <MachineProvider value={machine}>
      <Framed {...rest} {...machine.api.getRootProps()} />
    </MachineProvider>
  );
}
