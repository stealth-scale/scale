/**
 * Renders the image cropper's root and provides the api `useImageCropper` returns to the parts.
 *
 * @remarks
 *   The machine makes the root a `group` named "Image cropper" and describes the crop, the zoom and
 *   the rotation in English through `aria-description`. A caller names the root for the picture
 *   with `aria-label`, and writes the description in the reader's language with `description` and
 *   `loadingDescription`. The root passes `radius` to the viewport.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#image-cropper/context.ts";
import { ApiProvider, type ImageCropperApi } from "#image-cropper/machine.ts";
import { type Crop, rounded } from "#image-cropper/rounded.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what `description` receives: the crop in whole pixels, the zoom and the rotation.
 */
export interface DescriptionDetails {
  /**
   * The crop in the viewport's pixels.
   */
  readonly crop: Crop;

  /**
   * Rotation of the picture in degrees.
   */
  readonly rotation: number;

  /**
   * Zoom factor of the picture.
   */
  readonly zoom: number;
}

/**
 * Describes the props of the root: the api, the description's words, the recipe's variants and
 * the props of a `div`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Api `useImageCropper` returns.
   */
  readonly cropper: ImageCropperApi;

  /**
   * Returns the description a screen reader hears once the picture has loaded. Defaults to the
   * machine's English.
   */
  readonly description?: ((details: DescriptionDetails) => string) | undefined;

  /**
   * Description a screen reader hears while the picture loads. Defaults to the machine's English.
   */
  readonly loadingDescription?: string | undefined;
}

/**
 * Renders the root with the machine's root props, and provides the api to the parts.
 *
 * @param props - The api, the description's words, the recipe's variants and the props of a
 *   `div`.
 * @returns The `div` element inside the api provider.
 */
export function Root({
  cropper,
  description,
  loadingDescription,
  ...props
}: RootProps): ReactElement {
  const { naturalSize, rotation, zoom } = cropper;
  const described =
    naturalSize.width > 0 && naturalSize.height > 0
      ? description?.({ crop: rounded(cropper.crop), rotation, zoom })
      : loadingDescription;

  return (
    <ApiProvider value={cropper}>
      <Framed {...mergeProps(cropper.getRootProps(), { "aria-description": described }, props)} />
    </ApiProvider>
  );
}
