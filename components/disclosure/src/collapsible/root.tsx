/**
 * Renders the collapsible's root and starts the machine its parts share.
 *
 * @remarks
 *   The element is a `div` without a role. The trigger is a button and the content a block, and a
 *   role on the root would announce a widget that does not exist.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#collapsible/context.ts";
import {
  ApiProvider,
  type CollapsibleOptions,
  splitCollapsibleProps,
  useCollapsibleMachine,
} from "#collapsible/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives every
 *   ARIA reference from `id`.
 */
export interface RootProps
  extends CollapsibleOptions, Omit<ComponentProps<typeof Framed>, "dir" | "id"> {}

/**
 * Renders the root and provides the machine's api to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the api provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitCollapsibleProps(props);
  const api = useCollapsibleMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
