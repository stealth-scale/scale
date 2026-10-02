/**
 * Renders the QR code's root and starts the machine its parts share.
 *
 * @remarks
 *   The root is a grid around the code, its mark and its download buttons. The code and the mark
 *   share the first cell, and every other child takes a row below it. The root records whether a
 *   mark renders, which raises the code's error correction.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#qr-code/context.ts";
import {
  MachineProvider,
  MarkingProvider,
  type QrCodeOptions,
  splitQrCodeProps,
  useQrCodeMachine,
} from "#qr-code/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's `id`, `defaultValue` and `dir` are left out, because the machine takes them.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id">, QrCodeOptions {}

/**
 * Renders the root inside the provider of the running machine and the provider a mark reports to.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root(props: RootProps): ReactElement {
  const [marked, setMarked] = useState(false);
  const [options, rest] = splitQrCodeProps(props);
  const api = useQrCodeMachine(options, marked);

  return (
    <MachineProvider value={{ api, marked }}>
      <MarkingProvider value={setMarked}>
        <Framed {...mergeProps(api.getRootProps(), rest)} />
      </MarkingProvider>
    </MachineProvider>
  );
}
