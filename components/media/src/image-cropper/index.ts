/**
 * Exports the image cropper: `useImageCropper` for the machine an application starts, the six
 * parts, composed as `ImageCropper.Root` around a viewport with the picture and the selection, and
 * `handles`, the eight positions a selection's handles take.
 */

export {
  type CropChangeDetails,
  type CropData,
  type FlipChangeDetails,
  type FlipState,
  type GetCroppedImageOptions,
  type HandlePosition,
  handles,
  type RotationChangeDetails,
  type ZoomChangeDetails,
} from "@zag-js/image-cropper";

export { Grid, type GridProps } from "#image-cropper/grid.tsx";
export { Handle, type HandleProps } from "#image-cropper/handle.tsx";
export { Image, type ImageProps } from "#image-cropper/image.tsx";
export {
  type ImageCropperApi,
  type ImageCropperOptions,
  useImageCropper,
} from "#image-cropper/machine.ts";
export { type DescriptionDetails, Root, type RootProps } from "#image-cropper/root.tsx";
export { type Crop } from "#image-cropper/rounded.ts";
export { Selection, type SelectionProps } from "#image-cropper/selection.tsx";
export { Viewport, type ViewportProps } from "#image-cropper/viewport.tsx";
