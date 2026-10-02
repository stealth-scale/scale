import { createRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { composed, field, fileOf, typed } from "#composer/composer.fixtures.tsx";

describe("Input", () => {
  it("renders a textarea named Message", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe("TEXTAREA");
  });

  it("names the textarea by label", () => {
    render(composed({ input: { label: "Message Ada" } }));

    expect(screen.getByRole("textbox", { name: "Message Ada" })).toBeDefined();
  });

  it("starts at one row", () => {
    render(composed());

    expect(field().getAttribute("rows")).toBe("1");
  });

  it("writes 8 rows as its limit unless maxRows is stated", () => {
    render(composed());

    expect(field().style.getPropertyValue("--composer-rows")).toBe("8");
  });

  it("writes maxRows as its limit", () => {
    render(composed({ input: { maxRows: 4 } }));

    expect(field().style.getPropertyValue("--composer-rows")).toBe("4");
  });

  it("sends on Enter", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { onSubmit } }));
    typed("Approved.");
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(onSubmit.mock.lastCall).toStrictEqual(["Approved."]);
  });

  it("sends nothing on Enter in an empty textarea", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { onSubmit } }));
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends nothing on Shift+Enter", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { onSubmit } }));
    typed("Approved.");
    fireEvent.keyDown(field(), { key: "Enter", shiftKey: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("dismisses the reply on Escape", () => {
    const onCancelContext = vi.fn<() => void>();

    render(composed({ root: { onCancelContext } }));
    fireEvent.keyDown(field(), { key: "Escape" });

    expect(onCancelContext).toHaveBeenCalledTimes(1);
  });

  it("edits the last message on ArrowUp in an empty textarea", () => {
    const onEditLast = vi.fn<() => void>();

    render(composed({ root: { onEditLast } }));
    fireEvent.keyDown(field(), { key: "ArrowUp" });

    expect(onEditLast).toHaveBeenCalledTimes(1);
  });

  it("cancels the key it acts on", () => {
    render(composed({ root: { onEditLast: vi.fn<() => void>() } }));

    expect(fireEvent.keyDown(field(), { key: "ArrowUp" })).toBe(false);
  });

  it("leaves a key the caller cancelled alone", () => {
    const onEditLast = vi.fn<() => void>();

    render(
      composed({
        input: {
          onKeyDown: (event) => {
            event.preventDefault();
          },
        },
        root: { onEditLast },
      }),
    );
    fireEvent.keyDown(field(), { key: "ArrowUp" });

    expect(onEditLast).not.toHaveBeenCalled();
  });

  it("calls the caller's onChange", () => {
    const onChange = vi.fn<() => void>();

    render(composed({ input: { onChange } }));
    typed("A");

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("attaches the files a paste carries", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const file = fileOf("screenshot.png");

    render(composed({ root: { onAttach } }));

    expect([
      fireEvent.paste(field(), { clipboardData: { files: [file] } }),
      onAttach.mock.lastCall,
    ]).toStrictEqual([false, [[file]]]);
  });

  it("leaves a paste without files to the textarea", () => {
    const onAttach = vi.fn<(files: File[]) => void>();

    render(composed({ root: { onAttach } }));

    expect(fireEvent.paste(field(), { clipboardData: { files: [] } })).toBe(true);
  });

  it("leaves a paste of files to the textarea without onAttach", () => {
    render(composed());

    expect(fireEvent.paste(field(), { clipboardData: { files: [fileOf()] } })).toBe(true);
  });

  it("leaves a paste the caller cancelled alone", () => {
    const onAttach = vi.fn<(files: File[]) => void>();

    render(
      composed({
        input: {
          onPaste: (event) => {
            event.preventDefault();
          },
        },
        root: { onAttach },
      }),
    );
    fireEvent.paste(field(), { clipboardData: { files: [fileOf()] } });

    expect(onAttach).not.toHaveBeenCalled();
  });

  it("disables the textarea while the composer is disabled", () => {
    render(composed({ root: { disabled: true } }));

    expect(field().disabled).toBe(true);
  });

  it("passes the textarea to an object ref", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(composed({ input: { ref } }));

    expect(ref.current).toBe(field());
  });

  it("passes the textarea to a callback ref", () => {
    const ref = vi.fn<(element: HTMLTextAreaElement | null) => void>();

    render(composed({ input: { ref } }));

    expect(ref.mock.lastCall).toStrictEqual([field()]);
  });

  it("focuses the textarea after a send while the caller holds a ref", () => {
    render(composed({ input: { ref: createRef<HTMLTextAreaElement>() } }));
    typed("Approved.");
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(document.activeElement).toBe(field());
  });
});
