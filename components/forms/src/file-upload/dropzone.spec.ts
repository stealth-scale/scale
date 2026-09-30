import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  composed,
  dropped,
  framed,
  names,
  RECEIPT,
  STATEMENT,
} from "#file-upload/file-upload.fixtures.tsx";

/**
 * Returns the dropzone, found by its role and the words it shows.
 */
function dropzone(): HTMLElement {
  return screen.getByRole("button", { name: "Drop statements here" });
}

/**
 * Returns a clipboard's data with the given files, shaped as a browser's `DataTransfer`.
 */
function clipboard(files: readonly File[]): object {
  return { items: files.map((file) => ({ getAsFile: () => file, kind: "file" })) };
}

describe("Dropzone", () => {
  it("is a button named by its content", async () => {
    await drawn(composed());

    expect(dropzone().getAttribute("aria-label")).toBeNull();
  });

  it("takes part in the tab order", async () => {
    await drawn(composed());

    expect(dropzone().tabIndex).toBe(0);
  });

  it("opens the file picker on Enter", async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click");

    await drawn(composed());
    fireEvent.keyDown(dropzone(), { key: "Enter" });
    await settled();
    await framed();

    expect(click).toHaveBeenCalledExactlyOnceWith();
  });

  it("marks itself while files are dragged over it", async () => {
    await drawn(composed());
    fireEvent.dragOver(dropzone(), {
      dataTransfer: { items: [{ kind: "file" }], types: ["Files"] },
    });
    await settled();

    expect(dropzone().dataset["dragging"]).toBe("");
  });

  it("adds the files dropped on it", async () => {
    const { container } = await drawn(composed());

    await dropped(dropzone(), [STATEMENT, RECEIPT]);

    expect(names(slotElement(container, "file-upload", "itemGroup"))).toStrictEqual([
      "statement.pdf",
      "receipt.png",
    ]);
  });

  it("adds the files pasted into it", async () => {
    const { container } = await drawn(composed());

    fireEvent.paste(dropzone(), { clipboardData: clipboard([STATEMENT]) });
    await settled();

    expect(names(slotElement(container, "file-upload", "itemGroup"))).toStrictEqual([
      "statement.pdf",
    ]);
  });

  it("cancels a paste that contains files", async () => {
    await drawn(composed());

    const passed = fireEvent.paste(dropzone(), { clipboardData: clipboard([STATEMENT]) });

    await settled();

    expect(passed).toBe(false);
  });

  it("leaves a paste without files to the page", async () => {
    await drawn(composed());

    expect(fireEvent.paste(dropzone(), { clipboardData: clipboard([]) })).toBe(true);
  });

  it("leaves the tab order in a disabled upload", async () => {
    await drawn(composed({ disabled: true }));

    expect(dropzone().getAttribute("aria-disabled")).toBe("true");
  });
});
