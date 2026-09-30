/**
 * Renders the area a person drops files on, presses to pick files, or pastes files into.
 *
 * @remarks
 *   The element is a `div` in the `button` role and in the tab order. A press, Enter or Space opens
 *   the file picker, and dropped files join the upload. Files pasted while it has focus join it
 *   too, so a keyboard adds a copied file without a drag. It is named by its content, so the words
 *   a person reads are the words a screen reader speaks. Do not place a control inside it, because
 *   a button cannot contain another. A disabled or read-only upload takes it out of the tab order.
 */

import { type ClipboardEvent, type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";

/**
 * Renders the `div` with the file upload's dropzone class.
 */
const Dropped = withContext("div", "dropzone");

/**
 * Describes the props of the dropzone: the props of a `div`.
 */
export type DropzoneProps = ComponentProps<typeof Dropped>;

/**
 * Renders the dropzone with the machine's props, without the machine's name.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Dropzone(props: DropzoneProps): ReactElement {
  const api = useFileUpload();
  const { "aria-label": _named, ...machine } = api.getDropzoneProps();

  /**
   * Adds the pasted files to the upload, and cancels a paste that contains files.
   */
  function pasted(event: ClipboardEvent<HTMLDivElement>): void {
    if (api.setClipboardFiles(event.clipboardData)) event.preventDefault();
  }

  return <Dropped {...mergeProps(machine, { onPaste: pasted }, props)} />;
}
