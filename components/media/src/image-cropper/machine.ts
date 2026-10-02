/**
 * Starts the image cropper machine in application code and provides its api to the parts.
 *
 * @remarks
 *   An application calls `useImageCropper` and passes the api to `ImageCropper.Root`, so a control
 *   outside the root, such as a zoom slider or a save button, reads the crop and calls
 *   `getCroppedImage`. The machine's `translations` are left out: the parts take their words as
 *   props.
 */

import { useId } from "react";

import * as imageCropper from "@zag-js/image-cropper";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined } from "@stealthscale/hooks";

/**
 * Describes the api `useImageCropper` returns: the crop, the transforms, their setters, the export
 * and a prop getter per part.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine version. That
 *   type references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type ImageCropperApi = ReturnType<typeof imageCropper.connect>;

/**
 * Describes the machine settings a caller passes to `useImageCropper`, all optional.
 */
export type ImageCropperOptions = Omit<Partial<imageCropper.Props>, "translations">;

/**
 * Creates the context through which the root provides the api to its parts.
 *
 * @remarks
 *   `useImageCropperApi` throws when no `ImageCropper.Root` is mounted above the calling part.
 */
export const [ApiProvider, useImageCropperApi] =
  createRequiredContext<ImageCropperApi>("ImageCropper");

/**
 * Starts the image cropper machine and returns its connected api.
 *
 * @param options - The machine settings. A generated id is used when `id` is absent.
 * @returns The api the root provides to its parts.
 */
export function useImageCropper(options: ImageCropperOptions = {}): ImageCropperApi {
  const generated = useId();
  const service = useMachine(imageCropper.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return imageCropper.connect(service, normalizeProps);
}
