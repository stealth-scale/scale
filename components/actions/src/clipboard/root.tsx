/**
 * Draws the frame the label, the field and the trigger sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `div` and carries no role. A clipboard is a value and the button that copies
 *   it, and each of those carries its own meaning.
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
 * Draws the frame and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. Its
 *   `defaultValue` is left out too, because the machine's own is the value the parts copy.
 */
export interface RootProps
  extends ClipboardOptions, Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id"> {}

/**
 * Copies a value when its trigger is pressed and says so for a while.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The frame, holding the parts, under the running machine.
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
