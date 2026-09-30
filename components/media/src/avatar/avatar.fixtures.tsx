/**
 * Builds the avatars the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Fallback } from "#avatar/fallback.tsx";
import { Image } from "#avatar/image.tsx";
import { Root, type RootProps } from "#avatar/root.tsx";

/**
 * Name of the person every fixture shows.
 */
export const NAME = "Ada Okafor";

/**
 * Source of the picture, which a specification loads by firing the image's load event.
 */
export const PICTURE = "/ada.webp";

/**
 * Renders a part inside a root named by `NAME`.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains the part.
 */
export function named(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root name={NAME} {...props}>
      {children}
    </Root>
  );
}

/**
 * Renders an avatar named by `NAME` with its initials and a picture.
 *
 * @param props - The root's props.
 * @returns The avatar.
 */
export function pictured(props: RootProps = {}): ReactElement {
  return (
    <Root name={NAME} {...props}>
      <Fallback />
      <Image src={PICTURE} />
    </Root>
  );
}
