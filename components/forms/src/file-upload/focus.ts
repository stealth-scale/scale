/**
 * Moves focus after a button removes the row or the list it belongs to.
 *
 * @remarks
 *   A removed button takes focus with it, and the page drops focus to its body. After a row's
 *   delete trigger removes its file, focus moves to the delete trigger of the next row, or of the
 *   previous row when the last row went, and to the dropzone or the trigger when no row is left.
 *   After the clear trigger empties the list, focus moves to the dropzone or the trigger. The
 *   elements are found by an attribute selector, because a React ID contains characters an ID
 *   selector does not accept.
 */

import { type FileUploadApi } from "#file-upload/machine.ts";
import { type Filed } from "#file-upload/state.ts";

/**
 * Returns the ID in the props a machine gives a part.
 *
 * @param props - The props a prop getter of the machine returns.
 * @returns The ID, or nothing for props without one.
 */
export function idOf(props: Readonly<Record<string, unknown>>): string | undefined {
  const id = props["id"];

  return typeof id === "string" ? id : undefined;
}

/**
 * Returns the IDs of the controls that add files, which take focus once no row is left: the
 * dropzone, then the trigger.
 *
 * @param api - The connected api of the upload.
 * @returns The IDs, in order of preference.
 */
export function landings(api: FileUploadApi): Array<string | undefined> {
  return [idOf(api.getDropzoneProps()), idOf(api.getTriggerProps())];
}

/**
 * Returns the IDs of the controls that take focus after a row's file is removed: the next row's
 * delete trigger, the previous row's, then the controls that add files.
 *
 * @param api - The connected api of the upload.
 * @param item - The file the row renders and the list it belongs to.
 * @returns The IDs, in order of preference.
 */
export function successors(api: FileUploadApi, item: Filed): Array<string | undefined> {
  const files =
    item.type === "rejected"
      ? api.rejectedFiles.map((rejection) => rejection.file)
      : api.acceptedFiles;
  const at = files.indexOf(item.file);
  const neighbours = [files[at + 1], files[at - 1]].filter((file) => file !== undefined);

  return [
    ...neighbours.map((file) => idOf(api.getItemDeleteTriggerProps({ file, type: item.type }))),
    ...landings(api),
  ];
}

/**
 * Focuses the first rendered element that takes focus among the given IDs, one frame after the
 * change that removed the focused button.
 *
 * @param ids - The IDs to try, in order of preference.
 */
export function refocus(ids: ReadonlyArray<string | undefined>): void {
  requestAnimationFrame(() => {
    for (const id of ids) {
      const element = id === undefined ? null : document.querySelector<HTMLElement>(`[id="${id}"]`);

      element?.focus();

      if (element !== null && document.activeElement === element) return;
    }
  });
}
