/**
 * Renders the container of the label, the field and the trigger, and runs the machine they share.
 *
 * @remarks
 *   The container is a `div` without a role. The value and the trigger carry their own semantics,
 *   so a role on the container would add nothing for a screen reader.
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
 * `div` bound to the root slot, which provides the recipe's variants to the parts.
 */
const Styled = withProvider("div", "root");

/**
 * Props of `Clipboard.Root`: the machine settings and the props of the styled `div`.
 *
 * @remarks
 *   The element props omit `id` and `dir`, which the machine owns, and `defaultValue`, which is
 *   the machine's initial value.
 */
export interface RootProps
  extends ClipboardOptions, Omit<ComponentProps<typeof Styled>, "defaultValue" | "dir" | "id"> {}

/**
 * Starts a clipboard machine and renders the container its parts read from.
 *
 * @param props - Machine settings, recipe variants and `div` props.
 * @returns The container, with the connected API in context.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitClipboardProps(props);
  const api = useClipboardMachine(options);

  return (
    <ApiProvider value={api}>
      <Styled {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
