/**
 * Renders a picture of an image file inside its preview square.
 *
 * @remarks
 *   The element is an `img` whose source is an object URL of the file, made when the image mounts
 *   and revoked when it unmounts, so the page keeps no URL for a file it no longer shows. Its `alt`
 *   is empty by default, because the file's name is beside it. It renders nothing for a file whose
 *   type is not an image type, so a render function can place it in every row.
 */

import { type ComponentProps, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useItem } from "#file-upload/state.ts";

/**
 * Renders the `img` with the file upload's item preview image class.
 */
const Pictured = withContext("img", "itemPreviewImage");

/**
 * Describes the props of the preview image: the props of an `img` without `src`, which the file
 * sets.
 */
export type ItemPreviewImageProps = Omit<ComponentProps<typeof Pictured>, "src">;

/**
 * Returns a ref that points an image at an object URL of the file while the image is mounted.
 *
 * @param file - The image file.
 * @returns The ref, whose cleanup revokes the URL.
 */
function pointed(file: File): (image: HTMLImageElement | null) => () => void {
  return (image) => {
    const url = URL.createObjectURL(file);

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- React passes no null to a ref that returns a cleanup
    (image as HTMLImageElement).setAttribute("src", url);

    return (): void => {
      URL.revokeObjectURL(url);
    };
  };
}

/**
 * Renders the preview image with the machine's props, or nothing for a file that is not an image.
 *
 * @param props - Attributes of the `img` element, merged over the machine's.
 * @returns The `img` element, or nothing.
 */
export function ItemPreviewImage(props: ItemPreviewImageProps): ReactNode {
  const api = useFileUpload();
  const item = useItem();

  if (!item.file.type.startsWith("image/")) return null;

  const { src: _source, ...machine } = api.getItemPreviewImageProps({ ...item, url: "" });

  return <Pictured {...mergeProps(machine, { alt: "" }, props)} ref={pointed(item.file)} />;
}
