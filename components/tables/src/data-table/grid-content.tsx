/**
 * Renders a grid cell's content: the content with the cell's editor over it while the editor is
 * open, and the words of an unsaved change after it for assistive technology.
 */

import { type ReactElement, type ReactNode } from "react";

import { CellEditor, type CellEditorProps } from "#data-table/cell-editor.tsx";
import { HiddenText } from "#data-table/hidden-text.ts";

/**
 * Describes the props of a grid cell's content: the content, the open editor's props, and the words
 * of an unsaved change.
 */
export interface GridContentProps {
  /**
   * The cell's content.
   */
  readonly children: ReactNode;

  /**
   * Props of the cell's open editor, or undefined while the editor is closed.
   */
  readonly editor: Omit<CellEditorProps, "children"> | undefined;

  /**
   * Words of the cell's unsaved change, or undefined for a cell without one.
   */
  readonly unsaved: string | undefined;
}

/**
 * Renders the cell's content with its editor or its unsaved words.
 *
 * @param props - The content, the open editor's props and the unsaved words.
 * @returns The cell's content, under its editor or before its unsaved words.
 */
export function GridContent({ children, editor, unsaved }: GridContentProps): ReactElement {
  if (editor !== undefined) return <CellEditor {...editor}>{children}</CellEditor>;

  return (
    <>
      {children}
      {unsaved === undefined ? null : <HiddenText>{unsaved}</HiddenText>}
    </>
  );
}
