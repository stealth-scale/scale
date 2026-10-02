/**
 * Renders one handle of the selection, which a pointer drags to resize the crop.
 *
 * @remarks
 *   The machine places the handle on the selection's edge or corner its `position` names and hides
 *   it from assistive technology, because the selection resizes from the keyboard. An edge handle
 *   spans the edge. The handle is a 24px target with its visible dot centred inside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type HandlePosition } from "@zag-js/image-cropper";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#image-cropper/context.ts";
import { useImageCropperApi } from "#image-cropper/machine.ts";

/**
 * Renders the `div` with the image cropper's handle class.
 */
const Drawn = withContext("div", "handle");

/**
 * Describes the props of a handle: its position and the props of a `div`.
 */
export interface HandleProps extends Omit<ComponentProps<typeof Drawn>, "position"> {
  /**
   * Edge or corner of the selection the handle resizes, as a compass point.
   */
  readonly position: HandlePosition;
}

/**
 * Renders the handle with the machine's handle props merged over the caller's.
 *
 * @param props - The position and the props of a `div`.
 * @returns The `div` element.
 */
export function Handle({ position, ...props }: HandleProps): ReactElement {
  const api = useImageCropperApi();

  return <Drawn {...mergeProps(api.getHandleProps({ position }), props)} />;
}
