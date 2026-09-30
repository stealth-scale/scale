/**
 * Renders the avatar's picture, which the machine shows once it loads.
 *
 * @remarks
 *   The fallback renders while the picture loads and after it fails, so a broken link never shows
 *   the browser's broken-image mark. `alt` defaults to empty, because a root with `name` names the
 *   avatar. Pass `alt` to an avatar without a name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#avatar/context.ts";
import { useAvatar } from "#avatar/machine.ts";

/**
 * Renders the picture `img`.
 */
const Pictured = withContext("img", "image");

/**
 * Describes the props of `Image`.
 */
export type ImageProps = ComponentProps<typeof Pictured>;

/**
 * Renders the picture with the machine's load handlers merged under the caller's.
 *
 * @param props - The `img` element's props.
 * @returns The `img` element, hidden until it loads.
 */
export function Image({ alt = "", ...rest }: ImageProps): ReactElement {
  const api = useAvatar();

  return (
    <Pictured
      {...mergeProps(api.getImageProps(), {
        alt,
        draggable: false,
        referrerPolicy: "no-referrer",
        ...rest,
      })}
    />
  );
}
