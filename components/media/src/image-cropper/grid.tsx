/**
 * Renders the two lines of thirds across the selection on one axis.
 *
 * @remarks
 *   The machine places the lines a third in from each side, and the recipe shows them only while
 *   the selection is dragged or the picture is panned.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#image-cropper/context.ts";
import { useImageCropperApi } from "#image-cropper/machine.ts";

/**
 * Renders the `div` with the image cropper's grid class.
 */
const Drawn = withContext("div", "grid");

/**
 * Describes the props of the grid: its axis and the props of a `div`.
 */
export interface GridProps extends ComponentProps<typeof Drawn> {
  /**
   * Axis the two lines run along.
   */
  readonly axis: "horizontal" | "vertical";
}

/**
 * Renders the grid with the machine's grid props merged over the caller's.
 *
 * @param props - The axis and the props of a `div`.
 * @returns The `div` element.
 */
export function Grid({ axis, ...props }: GridProps): ReactElement {
  const api = useImageCropperApi();

  return <Drawn {...mergeProps(api.getGridProps({ axis }), props)} />;
}
