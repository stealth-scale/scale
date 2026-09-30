import { type ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CellEditor, type CellEditorProps } from "#data-table/cell-editor.tsx";
import { regionEditor, tableOf } from "#data-table/data-table.fixtures.tsx";
import { type EditorProps } from "#data-table/features.ts";
import { Root } from "#data-table/root.tsx";

/**
 * Renders a control that names a popup in `aria-controls`.
 */
function popping(props: EditorProps): ReactNode {
  return (
    <button aria-controls="grid-popup" id={props.id} type="button">
      Open
    </button>
  );
}

/**
 * Renders buttons that save, abandon and set the draft, and a second field.
 */
function manual(props: EditorProps): ReactNode {
  return (
    <>
      <button
        id={props.id}
        onClick={() => {
          props.commit();
        }}
        type="button"
      >
        Commit
      </button>
      <button onClick={props.cancel} type="button">
        Cancel
      </button>
      <button
        onClick={() => {
          props.setValue("900");
        }}
        type="button"
      >
        Nine hundred
      </button>
      <input aria-label="Note" />
    </>
  );
}

/**
 * Renders words without a control.
 */
function still(): ReactNode {
  return <span>Read only</span>;
}

/**
 * Renders a control that handles Tab itself.
 */
function tabbing(props: EditorProps): ReactNode {
  return (
    <input
      aria-label={props["aria-label"]}
      id={props.id}
      onKeyDown={(event) => {
        event.preventDefault();
      }}
    />
  );
}

/**
 * Renders the editor over "700" inside a root, with spies for its calls.
 */
function edited(given: Partial<CellEditorProps> = {}): {
  readonly onCancel: ReturnType<typeof vi.fn<() => void>>;
  readonly onCommit: ReturnType<typeof vi.fn<CellEditorProps["onCommit"]>>;
  readonly outer: ReturnType<typeof vi.fn<() => void>>;
} {
  const onCancel = vi.fn<() => void>();
  const onCommit = vi.fn<CellEditorProps["onCommit"]>();
  const outer = vi.fn<() => void>();

  render(
    <Root table={tableOf()}>
      <div onDoubleClick={outer} onKeyDown={outer} onMouseDown={outer} role="presentation">
        <CellEditor
          editor={undefined}
          error={undefined}
          label="Edit Amount"
          mode="caret"
          onCancel={onCancel}
          onCommit={onCommit}
          size="md"
          text="700"
          {...given}
        >
          €700
        </CellEditor>
      </div>
    </Root>,
  );

  return { onCancel, onCommit, outer };
}

/**
 * Returns the text field.
 */
function field(): HTMLInputElement {
  return screen.getByRole("textbox", { name: "Edit Amount" });
}

describe("CellEditor", () => {
  it("focuses the text field when the editor opens", () => {
    edited();

    expect(document.activeElement).toBe(field());
  });

  it("puts the caret after the text", () => {
    edited();

    expect([field().selectionStart, field().selectionEnd]).toStrictEqual([3, 3]);
  });

  it("hides the cell's content under the editor", () => {
    edited();

    expect(screen.getByText("€700").className).toContain("data-table__covered");
  });

  it("renders the text field at the table's size", () => {
    edited({ size: "sm" });

    expect(field().className).toContain("input--sm");
  });

  it("saves the draft and names Enter on Enter", () => {
    const { onCommit } = edited();

    fireEvent.change(field(), { target: { value: "800" } });
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(onCommit.mock.lastCall).toStrictEqual(["800", { key: "Enter", shift: false }]);
  });

  it("saves the draft and names Shift with Tab on Shift with Tab", () => {
    const { onCommit } = edited();

    fireEvent.keyDown(field(), { key: "Tab", shiftKey: true });

    expect(onCommit.mock.lastCall).toStrictEqual(["700", { key: "Tab", shift: true }]);
  });

  it("abandons the edit on Escape", () => {
    const { onCancel } = edited();

    fireEvent.keyDown(field(), { key: "Escape" });

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("keeps a key it handles from the cell", () => {
    const { outer } = edited();

    fireEvent.keyDown(field(), { key: "Escape" });

    expect(outer).not.toHaveBeenCalled();
  });

  it("saves and names an arrow on an arrow in type mode", () => {
    const { onCommit } = edited({ mode: "type" });

    fireEvent.keyDown(field(), { key: "ArrowDown" });

    expect(onCommit.mock.lastCall).toStrictEqual(["700", { key: "ArrowDown", shift: false }]);
  });

  it("leaves an arrow to the caret in caret mode", () => {
    const { onCommit } = edited();

    expect([fireEvent.keyDown(field(), { key: "ArrowDown" }), onCommit.mock.calls]).toStrictEqual([
      true,
      [],
    ]);
  });

  it("leaves a key the control handled to the control", () => {
    const { onCommit } = edited({ editor: tabbing });

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Edit Amount" }), { key: "Tab" });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("saves the value of a column's control on Tab", () => {
    const { onCommit } = edited({ editor: regionEditor, text: "North" });

    fireEvent.keyDown(screen.getByRole("combobox", { name: "Edit Amount" }), { key: "Tab" });

    expect(onCommit.mock.lastCall).toStrictEqual(["North", { key: "Tab", shift: false }]);
  });

  it("leaves Enter to a column's control", () => {
    const { onCommit } = edited({ editor: regionEditor, text: "North" });

    fireEvent.keyDown(screen.getByRole("combobox", { name: "Edit Amount" }), { key: "Enter" });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("saves the value a column's control passes", () => {
    const { onCommit } = edited({ editor: regionEditor, text: "North" });

    fireEvent.change(screen.getByRole("combobox", { name: "Edit Amount" }), {
      target: { value: "South" },
    });

    expect(onCommit.mock.lastCall).toStrictEqual(["South"]);
  });

  it("saves the draft a column's control sets", () => {
    const { onCommit } = edited({ editor: manual });

    fireEvent.click(screen.getByRole("button", { name: "Nine hundred" }));
    fireEvent.click(screen.getByRole("button", { name: "Commit" }));

    expect(onCommit.mock.lastCall).toStrictEqual(["900"]);
  });

  it("abandons the edit from a column's control", () => {
    const { onCancel } = edited({ editor: manual });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("saves the draft when focus leaves the editor", () => {
    const { onCommit } = edited();

    fireEvent.blur(field(), { relatedTarget: null });

    expect(onCommit.mock.lastCall).toStrictEqual(["700"]);
  });

  it("keeps the editor while focus moves inside it", () => {
    const { onCommit } = edited({ editor: manual });

    fireEvent.blur(screen.getByRole("button", { name: "Commit" }), {
      relatedTarget: screen.getByRole("textbox", { name: "Note" }),
    });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("keeps the editor while focus moves into the popup a control names", () => {
    const popup = document.createElement("div");
    const option = document.createElement("button");

    popup.id = "grid-popup";
    popup.append(option);
    document.body.append(popup);
    const { onCommit } = edited({ editor: popping });

    fireEvent.blur(screen.getByRole("button", { name: "Open" }), { relatedTarget: option });
    popup.remove();

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("saves the draft when focus moves outside the popup a control names", () => {
    const popup = document.createElement("div");
    const elsewhere = document.createElement("button");

    popup.id = "grid-popup";
    document.body.append(popup, elsewhere);
    const { onCommit } = edited({ editor: popping });

    fireEvent.blur(screen.getByRole("button", { name: "Open" }), { relatedTarget: elsewhere });
    popup.remove();
    elsewhere.remove();

    expect(onCommit.mock.calls).toStrictEqual([["700"]]);
  });

  it("saves the draft when focus moves elsewhere while the popup a control names is absent", () => {
    const elsewhere = document.createElement("button");

    document.body.append(elsewhere);
    const { onCommit } = edited({ editor: popping });

    fireEvent.blur(screen.getByRole("button", { name: "Open" }), { relatedTarget: elsewhere });
    elsewhere.remove();

    expect(onCommit.mock.calls).toStrictEqual([["700"]]);
  });

  it("states a refused value's reason in an alert that describes the field", () => {
    edited({ error: "Enter a whole number" });
    const alert = screen.getByRole("alert");

    expect([
      alert.textContent,
      field().getAttribute("aria-describedby"),
      field().getAttribute("aria-invalid"),
    ]).toStrictEqual(["Enter a whole number", alert.id, "true"]);
  });

  it("keeps a press inside the editor from the cell", () => {
    const { outer } = edited();

    fireEvent.mouseDown(field());
    fireEvent.doubleClick(field());

    expect(outer).not.toHaveBeenCalled();
  });

  it("focuses nothing when a column's control takes no id", () => {
    edited({ editor: still });

    expect(document.activeElement).toBe(document.body);
  });
});
