/**
 * Renders the `svg` that contains the code, as an image with a name.
 *
 * @remarks
 *   The frame is named "QR code" by default and never by the value, because a code can contain a
 *   secret, such as an authenticator key or a network password. A caller names it by what a scan
 *   does. The frame renders the ground under the pattern and, while a mark renders, the mark's
 *   ground over the middle quarter. Both have `fill="white"`, which the recipe replaces on screen,
 *   so a downloaded image is black on white in any program that opens it. A color the page
 *   computes is an `oklch()` value, which programs outside a browser do not read.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#qr-code/context.ts";
import { useQrCode } from "#qr-code/machine.ts";

/**
 * Renders the `svg` with the QR code's frame class.
 */
const Drawn = withContext("svg", "frame");

/**
 * Describes the props of the frame: its name and the props of an `svg`.
 */
export interface FrameProps extends ComponentProps<typeof Drawn> {
  /**
   * Accessible name of the code, "QR code" by default.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the frame with the ground under its children and the mark's ground over them, the
 * machine's props merged under the caller's.
 *
 * @param props - The name and the props of an `svg`, with the pattern as children.
 * @returns The `svg` element.
 */
export function Frame({ children, label = "QR code", ...props }: FrameProps): ReactElement {
  const { api, marked } = useQrCode();

  return (
    <Drawn {...mergeProps(api.getFrameProps(), { "aria-label": label, role: "img" }, props)}>
      <rect fill="white" height="100%" width="100%" />
      {children}
      {marked ? <rect fill="white" height="25%" width="25%" x="37.5%" y="37.5%" /> : null}
    </Drawn>
  );
}
