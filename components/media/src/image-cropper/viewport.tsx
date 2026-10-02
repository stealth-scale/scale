/**
 * Renders the viewport the picture is zoomed, turned and panned inside.
 *
 * @remarks
 *   The machine clips the viewport and pans the picture on a press outside the selection, or on
 *   any press while the crop area is fixed. The picture sets the viewport's shape.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#image-cropper/context.ts";
import { useImageCropperApi } from "#image-cropper/machine.ts";

/**
 * Renders the `div` with the image cropper's viewport class.
 */
const Drawn = withContext("div", "viewport");

/**
 * Describes the props of the viewport: the props of a `div`.
 */
export type ViewportProps = ComponentProps<typeof Drawn>;

/**
 * Renders the viewport with the machine's viewport props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Viewport(props: ViewportProps): ReactElement {
  const api = useImageCropperApi();

  return <Drawn {...mergeProps(api.getViewportProps(), props)} />;
}
