/**
 * Renders the picture being cropped.
 *
 * @remarks
 *   The machine hides the picture from assistive technology with an empty `alt`, because the root
 *   and the selection describe the crop, and reads its natural size once it loads. The machine
 *   zooms, turns and flips the picture through its `transform`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#image-cropper/context.ts";
import { useImageCropperApi } from "#image-cropper/machine.ts";

/**
 * Renders the `img` with the image cropper's image class.
 */
const Drawn = withContext("img", "image");

/**
 * Describes the props of the picture: the props of an `img`.
 */
export type ImageProps = ComponentProps<typeof Drawn>;

/**
 * Renders the picture with the machine's image props merged over the caller's.
 *
 * @param props - The props of an `img`, the source among them.
 * @returns The `img` element.
 */
export function Image(props: ImageProps): ReactElement {
  const api = useImageCropperApi();

  return <Drawn {...mergeProps(api.getImageProps(), props)} />;
}
