import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { composed, fileOf } from "#composer/composer.fixtures.tsx";

/**
 * Returns the composer's form.
 */
function box(container: HTMLElement): HTMLFormElement {
  const form = container.querySelector("form");

  if (form === null) throw new Error("The composer rendered no form.");

  return form;
}

/**
 * Renders a composer that attaches files, and returns its form.
 */
function attaching(): HTMLFormElement {
  const { container } = render(composed({ root: { onAttach: vi.fn<(files: File[]) => void>() } }));

  return box(container);
}

/**
 * Drags files over the box.
 */
function dragged(form: HTMLFormElement): void {
  fireEvent.dragOver(form, { dataTransfer: { files: [fileOf()] } });
}

/**
 * Leaves the box for the related target given.
 *
 * @remarks
 *   Happy-dom's `DragEvent` is a bare `Event`, which drops `relatedTarget`, so the case sends the
 *   mouse event a browser's drag events extend.
 */
function left(form: HTMLFormElement, relatedTarget: EventTarget | null): void {
  fireEvent(form, new MouseEvent("dragleave", { bubbles: true, relatedTarget }));
}

describe("useDrop", () => {
  it("marks the box while files are dragged over it", () => {
    const form = attaching();

    dragged(form);

    expect(form.dataset["dragging"]).toBe("");
  });

  it("marks nothing without onAttach", () => {
    const { container } = render(composed());

    dragged(box(container));

    expect(box(container).dataset["dragging"]).toBeUndefined();
  });

  it("marks nothing while disabled", () => {
    const { container } = render(
      composed({ root: { disabled: true, onAttach: vi.fn<(files: File[]) => void>() } }),
    );

    dragged(box(container));

    expect(box(container).dataset["dragging"]).toBeUndefined();
  });

  it("keeps the mark while the drag moves onto a child of the box", () => {
    const form = attaching();

    dragged(form);
    left(form, screen.getByRole("textbox"));

    expect(form.dataset["dragging"]).toBe("");
  });

  it("drops the mark once the drag leaves the box", () => {
    const form = attaching();

    dragged(form);
    left(form, document.body);

    expect(form.dataset["dragging"]).toBeUndefined();
  });

  it("drops the mark when the drag leaves the window", () => {
    const form = attaching();

    dragged(form);
    left(form, null);

    expect(form.dataset["dragging"]).toBeUndefined();
  });

  it("attaches the files dropped on the box", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const { container } = render(composed({ root: { onAttach } }));
    const file = fileOf();

    fireEvent.drop(box(container), { dataTransfer: { files: [file] } });

    expect(onAttach.mock.lastCall).toStrictEqual([[file]]);
  });

  it("attaches nothing for a drop without files", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const { container } = render(composed({ root: { onAttach } }));

    fireEvent.drop(box(container), { dataTransfer: { files: [] } });

    expect(onAttach).not.toHaveBeenCalled();
  });

  it("attaches nothing while disabled", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const { container } = render(composed({ root: { disabled: true, onAttach } }));

    fireEvent.drop(box(container), { dataTransfer: { files: [fileOf()] } });

    expect(onAttach).not.toHaveBeenCalled();
  });

  it("drops the mark after a drop", () => {
    const form = attaching();

    dragged(form);
    fireEvent.drop(form, { dataTransfer: { files: [fileOf()] } });

    expect(form.dataset["dragging"]).toBeUndefined();
  });
});
