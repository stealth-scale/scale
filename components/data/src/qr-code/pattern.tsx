/**
 * Renders the dark modules of the code as one path.
 *
 * @remarks
 *   The path has `fill="black"`, which the recipe replaces on screen, so a downloaded image is
 *   black on white. The download serializes the frame without the page's stylesheet.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#qr-code/context.ts";
import { useQrCode } from "#qr-code/machine.ts";

/**
 * Renders the `path` with the QR code's pattern class.
 *
 * @remarks
 *   `d` and `fill` are CSS properties as well as attributes, so the factory would read them as
 *   style props. It forwards both to the element.
 */
const Traced = withContext("path", "pattern", { forwardProps: ["d", "fill"] });

/**
 * Describes the props of the pattern: the props of a `path`.
 */
export type PatternProps = ComponentProps<typeof Traced>;

/**
 * Renders the pattern with the machine's props merged under the caller's.
 *
 * @param props - The props of a `path`.
 * @returns The `path` element.
 */
export function Pattern(props: PatternProps): ReactElement {
  const { api } = useQrCode();

  return <Traced {...mergeProps(api.getPatternProps(), { fill: "black" }, props)} />;
}
