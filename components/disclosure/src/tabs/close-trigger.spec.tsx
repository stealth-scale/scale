import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { CloseTrigger } from "#tabs/close-trigger.tsx";
import { type CloseDetails } from "#tabs/closing.ts";
import { Root } from "#tabs/root.tsx";
import { closable, tabbed } from "#tabs/tabs.fixtures.tsx";

/**
 * Returns the close trigger inside the tab named by its value.
 */
function glyphOf(name: string): HTMLElement {
  return within(screen.getByRole("tab", { name })).getByTitle("Close");
}

describe("CloseTrigger", () => {
  it("renders a span", async () => {
    const { container } = await drawn(tabbed(<CloseTrigger />));

    expect(slotElement(container, "tabs", "closeTrigger").tagName).toBe("SPAN");
  });

  it("sets aria-hidden", async () => {
    await drawn(closable());

    expect(glyphOf("first").getAttribute("aria-hidden")).toBe("true");
  });

  it("titles the control Close by default", async () => {
    const { container } = await drawn(tabbed(<CloseTrigger />));

    expect(slotElement(container, "tabs", "closeTrigger").title).toBe("Close");
  });

  it("titles the control by label", async () => {
    const { container } = await drawn(tabbed(<CloseTrigger label="Schließen" />));

    expect(slotElement(container, "tabs", "closeTrigger").title).toBe("Schließen");
  });

  it("closes its tab on a press", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    fireEvent.click(glyphOf("fourth"));
    await settled();

    expect(onClose).toHaveBeenCalledExactlyOnceWith({ value: "fourth" });
  });

  it("leaves the selection on a press in another tab", async () => {
    await drawn(closable());
    fireEvent.click(glyphOf("fourth"));
    await settled();

    expect(screen.getByRole("tab", { name: "second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("cancels a mousedown so its tab takes no focus", async () => {
    await drawn(closable());

    expect(fireEvent.mouseDown(glyphOf("first"))).toBe(false);
  });

  it("cancels the press", async () => {
    await drawn(closable());

    const uncancelled = fireEvent.click(glyphOf("first"));

    await settled();

    expect(uncancelled).toBe(false);
  });

  it("closes nothing outside a tab", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();
    const { container } = await drawn(
      <Root onClose={onClose}>
        <CloseTrigger />
      </Root>,
    );

    fireEvent.click(slotElement(container, "tabs", "closeTrigger"));
    await settled();

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls a caller's onClick", async () => {
    const heard = vi.fn<() => void>();
    const { container } = await drawn(tabbed(<CloseTrigger onClick={heard} />));

    fireEvent.click(slotElement(container, "tabs", "closeTrigger"));

    expect(heard).toHaveBeenCalledOnce();
  });
});
