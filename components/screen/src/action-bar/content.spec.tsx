import { createPortal } from "react-dom";

import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { barred, framed, redrawn } from "#action-bar/action-bar.fixtures.tsx";
import { type OpenChangeDetails } from "#action-bar/root.tsx";

describe("Content", () => {
  it("renders a div around the toolbar", async () => {
    const { container } = await drawn(barred());

    expect(slotElement(container, "action-bar", "content").firstElementChild).toBe(
      screen.getByRole("toolbar"),
    );
  });

  it("calls onOpenChange with open false on Escape", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(barred({ onOpenChange: told }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "Escape" });

    expect(told).toHaveBeenCalledExactlyOnceWith({ open: false });
  });

  it("ignores Escape with closeOnEscape false", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(barred({ closeOnEscape: false, onOpenChange: told }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "Escape" });

    expect(told).not.toHaveBeenCalled();
  });

  it("ignores an Escape a control inside the bar handled", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(
      barred(
        { onOpenChange: told },
        <input
          aria-label="Rename"
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />,
      ),
    );
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Rename" }), { key: "Escape" });

    expect(told).not.toHaveBeenCalled();
  });

  it("ignores an Escape on a control portalled out of the bar", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(
      barred(
        { onOpenChange: told },
        createPortal(<button type="button">Move to folder</button>, document.body),
      ),
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Move to folder" }), { key: "Escape" });

    expect(told).not.toHaveBeenCalled();
  });

  it("ignores keys other than Escape", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(barred({ onOpenChange: told }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "Enter" });

    expect(told).not.toHaveBeenCalled();
  });

  it("calls the caller's onKeyDown", async () => {
    const pressed = vi.fn<() => void>();

    await drawn(barred({}, undefined, { onKeyDown: pressed }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "Escape" });

    expect(pressed).toHaveBeenCalledOnce();
  });

  it("ignores an Escape the caller's onKeyDown prevented", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(
      barred({ onOpenChange: told }, undefined, {
        onKeyDown: (event) => {
          event.preventDefault();
        },
      }),
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "Escape" });

    expect(told).not.toHaveBeenCalled();
  });

  it("leaves focus on the selection when the bar opens", async () => {
    const { rerender } = await drawn(barred({ open: false }));

    screen.getByRole("button", { name: "Select invoices" }).focus();
    await redrawn(rerender, barred());

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Select invoices" }));
  });

  it("returns focus to the selection when the bar closes with focus inside it", async () => {
    const { rerender } = await drawn(barred({ open: false }));

    screen.getByRole("button", { name: "Select invoices" }).focus();
    await redrawn(rerender, barred());
    act(() => {
      screen.getByRole("button", { name: "Download" }).focus();
    });
    await redrawn(rerender, barred({ open: false }));
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Select invoices" }));
  });

  it("returns focus to the selection when a bar kept by unmountOnExit false closes", async () => {
    const { rerender } = await drawn(barred({ open: false, unmountOnExit: false }));

    screen.getByRole("button", { name: "Select invoices" }).focus();
    await redrawn(rerender, barred({ unmountOnExit: false }));
    act(() => {
      screen.getByRole("button", { name: "Download" }).focus();
    });
    await redrawn(rerender, barred({ open: false, unmountOnExit: false }));
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Select invoices" }));
  });

  it("keeps the hidden bar once it closes with unmountOnExit false", async () => {
    const { container, rerender } = await drawn(barred({ unmountOnExit: false }));

    await redrawn(rerender, barred({ open: false, unmountOnExit: false }));
    await framed();

    expect(slotElement(container, "action-bar", "content").hidden).toBe(true);
  });
});
