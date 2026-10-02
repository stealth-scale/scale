/**
 * Renders the selection: the part of the picture the crop keeps, with the rest dimmed.
 *
 * @remarks
 *   The machine makes the selection a focusable `slider` with the English label "Crop selection
 *   area", the role description "2d slider", instructions and a value text of its position and
 *   size. The arrows move the crop, Alt with an arrow resizes it, plus and minus zoom, and Shift or
 *   Control take larger steps. A caller writes the words in the reader's language with
 *   `aria-label`, `aria-roledescription`, `aria-description` and `valueText`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#image-cropper/context.ts";
import { useImageCropperApi } from "#image-cropper/machine.ts";
import { type Crop, rounded } from "#image-cropper/rounded.ts";

/**
 * Renders the `div` with the image cropper's selection class.
 */
const Drawn = withContext("div", "selection");

/**
 * Describes the props of the selection: the value text's words and the props of a `div`.
 */
export interface SelectionProps extends ComponentProps<typeof Drawn> {
  /**
   * Returns the value text a screen reader hears from the crop in whole pixels. Defaults to the
   * machine's English.
   */
  readonly valueText?: ((crop: Crop) => string) | undefined;
}

/**
 * Renders the selection with the machine's selection props, the value text and the caller's props.
 *
 * @param props - The value text's words and the props of a `div`, the handles and grid among its
 *   children.
 * @returns The `div` element.
 */
export function Selection({ valueText, ...props }: SelectionProps): ReactElement {
  const api = useImageCropperApi();

  return (
    <Drawn
      {...mergeProps(
        api.getSelectionProps(),
        { "aria-valuetext": valueText?.(rounded(api.crop)) },
        props,
      )}
    />
  );
}
