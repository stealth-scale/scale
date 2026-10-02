/**
 * Renders one item per file of the list around it through a render function.
 *
 * @remarks
 *   The function receives each file and the reasons the upload refused it, which are empty in the
 *   list of accepted files, in the order the files arrived. It returns the item for that file,
 *   usually a `FileUpload.Item`. Items renders no element of its own. An item keeps its key while
 *   its file is in the list, so removing one file leaves the other rows mounted.
 */

import { Fragment, type ReactNode } from "react";

import { type FileError, useFileUpload } from "#file-upload/machine.ts";
import { useListed } from "#file-upload/state.ts";

/**
 * Describes the props of the items: the render function.
 */
export interface ItemsProps {
  /**
   * Render function called with each file and the reasons the upload refused it.
   */
  readonly children: (file: File, errors: readonly FileError[]) => ReactNode;
}

/**
 * Returns a key for each file: its name, size and modification time, and a count for a file that
 * repeats in the list.
 *
 * @param files - The files, in list order.
 * @returns One key per file, in the same order.
 */
function keysOf(files: readonly File[]): string[] {
  const seen = new Map<string, number>();

  return files.map((file) => {
    const key = `${file.name}:${String(file.size)}:${String(file.lastModified)}`;
    const count = seen.get(key) ?? 0;

    seen.set(key, count + 1);

    return `${key}:${String(count)}`;
  });
}

/**
 * Calls the render function once per file of the list.
 *
 * @param props - The render function, as `children`.
 * @returns The items the render function returns, one per file.
 */
export function Items({ children }: ItemsProps): ReactNode {
  const api = useFileUpload();
  const entries =
    useListed() === "rejected"
      ? api.rejectedFiles
      : api.acceptedFiles.map((file) => ({ errors: [], file }));
  const keys = keysOf(entries.map((entry) => entry.file));

  return entries.map(({ errors, file }, index) => (
    <Fragment key={keys[index]}>{children(file, errors)}</Fragment>
  ));
}
