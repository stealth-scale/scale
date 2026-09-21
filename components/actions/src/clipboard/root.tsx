/**
 * Renders the container holding the label, the field and the trigger, and runs the machine they
 * share.
 *
 * @remarks
 *   The container is a plain `div` with no ARIA role. A clipboard is a value plus a button that
 *   copies it, and each of those already carries its own semantics, so a role on the wrapper would
 *   tell a screen reader nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#clipboard/context.ts";
import {
  ApiProvider,
  type ClipboardOptions,
  splitClipboardProps,
  useClipboardMachine,
} from "#clipboard/machine.ts";

/**
 * Renders the root slot and publishes the recipe's variants to the parts below it.
 */
const Framed = withProvider("div", "root");

/**
 * Merges the machine's settings with the props of the styled div.
 *
 * @remarks
 *   `id` and `dir` are dropped from the element's props because the machine owns both, and
 *   `defaultValue` because the machine's is the value the parts copy.
 */
export interface RootProps
  extends ClipboardOptions, Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id"> {}

/**
 * Starts a clipboard machine and renders the container its parts read from.
 *
 * @param props - The machine's settings, the recipe's variants and the div's props in one object.
 * @returns The container, with the connected api in context for the parts.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitClipboardProps(props);
  const api = useClipboardMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
