/**
 * Saves data built in the page to a file on the reader's device.
 *
 * @remarks
 *   Zag's `downloadFile` hands the browser an object URL through an anchor with a `download`
 *   attribute and revokes the URL once the anchor is pressed. Nothing is fetched and no server is
 *   involved. A menu row, or any control other than `DownloadTrigger`, calls `download` from its
 *   own handler.
 */

import { downloadFile, type FileMimeType } from "@zag-js/file-utils";

/**
 * Contents of a file: text, a `Blob` or a `File`.
 */
export type DownloadableData = Blob | string;

/**
 * Options of `download`, which `DownloadTrigger` takes as props.
 */
export interface DownloadOptions {
  /**
   * Contents of the file, or a function called on every download that returns them or a promise of
   * them.
   */
  readonly data: (() => DownloadableData | Promise<DownloadableData>) | DownloadableData;

  /**
   * Name the browser saves the file under, extension included.
   */
  readonly fileName: string;

  /**
   * Type of text data. A `Blob` or a `File` keeps its own type.
   */
  readonly mimeType?: FileMimeType | undefined;
}

/**
 * Resolves the data and hands it to the browser as a file.
 *
 * @returns A promise that settles once the browser has the file, and rejects when the data
 *   function throws or its promise rejects.
 */
export async function download({ data, fileName, mimeType = "" }: DownloadOptions): Promise<void> {
  const file = typeof data === "function" ? await data() : data;

  downloadFile({ file, name: fileName, type: mimeType });
}
