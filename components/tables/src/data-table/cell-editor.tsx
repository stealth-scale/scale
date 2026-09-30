/**
 * Renders a grid cell's editor over the cell: the column's control, or a text field at the table's
 * size, and the reason a value was refused under the cell.
 *
 * @remarks
 *   The cell's content remains under the editor, hidden, so the cell keeps its size. The control
 *   with the editor's `id` takes focus when the editor opens, a text field with the caret after its
 *   text. In the text field Enter saves and moves down, and in type mode an arrow saves and moves
 *   in its direction. Tab saves and moves to the next cell, Shift with Tab to the previous one, and
 *   Escape abandons the edit, in every control unless the control handles the key itself. Focus
 *   leaving the editor saves the draft, unless it moves into a popup that a control inside the
 *   editor names in `aria-controls`. A press inside the editor remains with the control. The
 *   column's control renders as a component, so it may call hooks.
 */

import {
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
  useId,
  useLayoutEffect,
  useState,
} from "react";

import { Input } from "@stealthscale/component-forms";

import { Covered, Editor, EditorError } from "#data-table/bound.ts";
import { type EditMode, type Leave } from "#data-table/editing.ts";
import { type EditorProps } from "#data-table/features.ts";
import { renderedOf } from "#data-table/templates.tsx";

/**
 * Describes the props of a cell's editor: the cell's content, the column's control, the reason a
 * value was refused, the words, the mode, the size, the text and the calls that save or abandon.
 */
export interface CellEditorProps {
  /**
   * The cell's content, which remains under the editor.
   */
  readonly children: ReactNode;

  /**
   * Renders the column's control, or undefined for the text field.
   */
  readonly editor: ((props: EditorProps) => ReactNode) | undefined;

  /**
   * Reason the last value saved was refused, or undefined.
   */
  readonly error: string | undefined;

  /**
   * Accessible name of the control.
   */
  readonly label: string;

  /**
   * How the text field treats the arrows.
   */
  readonly mode: EditMode;

  /**
   * Abandons the edit.
   */
  readonly onCancel: () => void;

  /**
   * Saves a text, with the key that saved it.
   */
  readonly onCommit: (text: string, leave?: Leave) => void;

  /**
   * Size of the table, which the control takes.
   */
  readonly size: EditorProps["size"];

  /**
   * Text the editor opens with.
   */
  readonly text: string;
}

/**
 * Describes what the editor's box reads to handle its keys and focus: the draft, whether the
 * control is the text field, the mode, and the calls that save or abandon.
 */
interface Session {
  /**
   * Abandons the edit.
   */
  readonly cancel: () => void;

  /**
   * The draft.
   */
  readonly draft: string;

  /**
   * Whether the control is the text field.
   */
  readonly field: boolean;

  /**
   * How the text field treats the arrows.
   */
  readonly mode: EditMode;

  /**
   * Saves a text, with the key that saved it.
   */
  readonly save: (text: string, leave?: Leave) => void;
}

/**
 * Renders the text field, the control of a column that states no editor.
 */
function textField(props: EditorProps): ReactNode {
  return (
    <Input
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      aria-label={props["aria-label"]}
      id={props.id}
      onChange={(event) => {
        props.setValue(event.currentTarget.value);
      }}
      size={props.size}
      value={props.value}
    />
  );
}

/**
 * Returns what a keystroke in an editor does: abandon the edit, save and leave, or nothing the
 * editor handles.
 */
function actionOf(
  event: KeyboardEvent<HTMLElement>,
  field: boolean,
  mode: EditMode,
): "cancel" | Leave | undefined {
  if (event.defaultPrevented) return undefined;
  if (event.key === "Escape") return "cancel";

  const leave = { key: event.key, shift: event.shiftKey };

  if (event.key === "Tab") return leave;
  if (!field) return undefined;

  return event.key === "Enter" || (mode === "type" && event.key.startsWith("Arrow"))
    ? leave
    : undefined;
}

/**
 * Returns whether focus moving to a target keeps it with the editor: inside the editor, or inside
 * a popup that a control inside the editor names in `aria-controls`.
 */
function keptBy(host: HTMLElement, target: EventTarget | null): boolean {
  if (!(target instanceof Node)) return false;
  if (host.contains(target)) return true;

  return [...host.querySelectorAll("[aria-controls]")].some((control) =>
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the selector matched the attribute
    (control.getAttribute("aria-controls") as string)
      .split(" ")
      .some((id) => host.ownerDocument.querySelector(`[id="${id}"]`)?.contains(target) === true),
  );
}

/**
 * Stops an event at the editor, so no cell handler receives a press or a double click inside it.
 */
function stopped(event: SyntheticEvent): void {
  event.stopPropagation();
}

/**
 * Describes the handlers of the editor's box.
 */
interface Handlers {
  /**
   * Saves the draft when focus leaves the editor.
   */
  readonly onBlur: (event: FocusEvent<HTMLElement>) => void;

  /**
   * Keeps a double click inside the editor from the cell.
   */
  readonly onDoubleClick: (event: SyntheticEvent) => void;

  /**
   * Saves and leaves, or abandons the edit, on the editor's keys.
   */
  readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;

  /**
   * Keeps a press inside the editor from the cell.
   */
  readonly onMouseDown: (event: SyntheticEvent) => void;
}

/**
 * Returns the handlers of the editor's box: its keys, its focus leaving, and the presses it keeps.
 */
function handlersOf(session: Session): Handlers {
  return {
    onBlur: (event) => {
      if (!keptBy(event.currentTarget, event.relatedTarget)) session.save(session.draft);
    },
    onDoubleClick: stopped,
    onKeyDown: (event) => {
      const action = actionOf(event, session.field, session.mode);

      if (action === undefined) return;

      event.preventDefault();
      event.stopPropagation();
      if (action === "cancel") session.cancel();
      else session.save(session.draft, action);
    },
    onMouseDown: stopped,
  };
}

/**
 * Renders the cell's content hidden, the control over it and the reason under the cell.
 *
 * @param props - The content, the control, the reason, the words, the mode, the size, the text and
 *   the calls that save or abandon.
 * @returns The hidden content and the editor.
 */
export function CellEditor({
  children,
  editor,
  error,
  label,
  mode,
  onCancel,
  onCommit,
  size,
  text,
}: CellEditorProps): ReactElement {
  const id = useId();
  const [draft, setDraft] = useState(text);
  const errorId = `${id}-error`;

  useLayoutEffect(() => {
    const control = document.querySelector<HTMLElement>(`[id="${id}"]`);

    control?.focus();
    if (control instanceof HTMLInputElement) {
      control.setSelectionRange(control.value.length, control.value.length);
    }
  }, [id]);

  const session = { cancel: onCancel, draft, field: editor === undefined, mode, save: onCommit };

  return (
    <>
      <Covered>{children}</Covered>
      <Editor {...handlersOf(session)}>
        {renderedOf(editor ?? textField, {
          "aria-describedby": error === undefined ? undefined : errorId,
          "aria-invalid": error !== undefined,
          "aria-label": label,
          cancel: onCancel,
          commit: (next?: string) => {
            onCommit(next ?? draft);
          },
          id,
          setValue: setDraft,
          size,
          value: draft,
        })}
        {error === undefined ? null : (
          <EditorError id={errorId} role="alert">
            {error}
          </EditorError>
        )}
      </Editor>
    </>
  );
}
