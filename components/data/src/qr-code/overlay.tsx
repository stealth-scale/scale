/**
 * Renders a mark over the middle of the code, such as a logo.
 *
 * @remarks
 *   The mark covers modules, so while it renders the root encodes at error correction `H`, which
 *   recovers up to 30% of the code. At the machine's default `L`, a code under a mark a quarter of
 *   its side does not decode. The mark is hidden from assistive technology, because the frame's
 *   name describes the code. A download includes the mark.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#qr-code/context.ts";
import { useMarked, useQrCode } from "#qr-code/machine.ts";

/**
 * Renders the `div` with the QR code's overlay class.
 */
const Marked = withContext("div", "overlay");

/**
 * Describes the props of the overlay: the props of a `div`, with the mark as children.
 */
export type OverlayProps = ComponentProps<typeof Marked>;

/**
 * Renders the overlay with the machine's props merged under the caller's, and reports it to the
 * root.
 *
 * @param props - The props of a `div`, with the mark as children.
 * @returns The `div` element.
 */
export function Overlay(props: OverlayProps): ReactElement {
  const { api } = useQrCode();

  useMarked();

  return <Marked {...mergeProps(api.getOverlayProps(), { "aria-hidden": true }, props)} />;
}
