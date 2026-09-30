/**
 * Tracks files dragged over the composer's box, and attaches the files dropped on it.
 *
 * @remarks
 *   The box accepts a drag only while `onAttach` is set and the composer is enabled, so a browser
 *   shows no drop cursor over a composer that attaches nothing. A drag that moves between the box's
 *   own children keeps the mark, and one that leaves the box drops it.
 */

import { type DragEvent, useState } from "react";

/**
 * Describes what the hook returns: whether files are over the box, and the box's drag handlers.
 */
export interface Drop {
  /**
   * Whether files are dragged over the box.
   */
  readonly dragging: boolean;

  /**
   * Handles a drag that leaves the box or moves between its children.
   */
  readonly onDragLeave: (event: DragEvent<HTMLFormElement>) => void;

  /**
   * Handles a drag over the box.
   */
  readonly onDragOver: (event: DragEvent<HTMLFormElement>) => void;

  /**
   * Handles a drop on the box.
   */
  readonly onDrop: (event: DragEvent<HTMLFormElement>) => void;
}

/**
 * Returns whether files are over the box, and the handlers that attach the files dropped on it.
 *
 * @param onAttach - Called with the files dropped, the composer's attach handler.
 * @param disabled - Whether the composer takes no input.
 * @returns The mark and the three handlers.
 */
export function useDrop(onAttach: ((files: File[]) => void) | undefined, disabled: boolean): Drop {
  const [dragging, setDragging] = useState(false);
  const drops = onAttach !== undefined && !disabled;

  /**
   * Accepts a drag over the box.
   *
   * @param event - The drag event, which the hook cancels to allow a drop.
   */
  function onDragOver(event: DragEvent<HTMLFormElement>): void {
    if (!drops) return;

    event.preventDefault();
    setDragging(true);
  }

  /**
   * Drops the mark once the drag leaves the box.
   *
   * @param event - The drag event, whose related target is where the drag went.
   */
  function onDragLeave(event: DragEvent<HTMLFormElement>): void {
    const next = event.relatedTarget;

    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setDragging(false);
  }

  /**
   * Attaches the files dropped on the box.
   *
   * @param event - The drop event, which the hook cancels when it attaches.
   */
  function onDrop(event: DragEvent<HTMLFormElement>): void {
    const files = [...event.dataTransfer.files];

    setDragging(false);

    if (!drops || files.length === 0) return;

    event.preventDefault();
    onAttach(files);
  }

  return { dragging, onDragLeave, onDragOver, onDrop };
}
