import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { composed, fileOf, pressed } from "#composer/composer.fixtures.tsx";

/**
 * Returns the hidden file input.
 */
function picker(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>("input[type=file]");

  if (input === null) throw new Error("The attach control rendered no file input.");

  return input;
}

describe("AttachTrigger", () => {
  it("renders a button named Attach files", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Attach files" })).toBeDefined();
  });

  it("names the button by label", () => {
    render(composed({ attach: { label: "Add a file" } }));

    expect(screen.getByRole("button", { name: "Add a file" })).toBeDefined();
  });

  it("opens the file picker when pressed", () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click");

    render(composed());
    pressed("Attach files");

    expect(click).toHaveBeenCalledTimes(1);
  });

  it("calls the caller's onClick when pressed", () => {
    const onClick = vi.fn<() => void>();

    render(composed({ attach: { onClick } }));
    pressed("Attach files");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the file input hidden", () => {
    const { container } = render(composed({ attach: { accept: "image/*" } }));

    expect([picker(container).hidden, picker(container).accept]).toStrictEqual([true, "image/*"]);
  });

  it("attaches the files picked", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const { container } = render(composed({ root: { onAttach } }));
    const file = fileOf();

    fireEvent.change(picker(container), { target: { files: [file] } });

    expect(onAttach.mock.lastCall).toStrictEqual([[file]]);
  });

  it("attaches nothing when the picker returns no file", () => {
    const onAttach = vi.fn<(files: File[]) => void>();
    const { container } = render(composed({ root: { onAttach } }));

    fireEvent.change(picker(container), { target: { files: [] } });

    expect(onAttach).not.toHaveBeenCalled();
  });

  it("attaches nothing without onAttach", () => {
    const { container } = render(composed());

    expect(() => {
      fireEvent.change(picker(container), { target: { files: [fileOf()] } });
    }).not.toThrow();
  });

  it("disables the button while the composer is disabled", () => {
    render(composed({ root: { disabled: true } }));

    expect(screen.getByRole("button", { name: "Attach files" })).toHaveProperty("disabled", true);
  });
});
