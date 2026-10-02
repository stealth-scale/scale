import { act, fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { type CloseDetails, selectionAfterClose } from "#tabs/closing.ts";
import { closable } from "#tabs/tabs.fixtures.tsx";

/**
 * Returns the tab named by its value.
 */
function tab(name: string): HTMLElement {
  return screen.getByRole("tab", { name });
}

/**
 * Presses the close trigger of the tab named by its value, and settles the machine.
 */
async function closed(name: string): Promise<void> {
  fireEvent.click(within(tab(name)).getByTitle("Close"));
  await settled();
}

/**
 * Returns the value of the selected tab, or "none".
 */
function selected(): string {
  return (
    screen.queryAllByRole("tab").find((each) => each.getAttribute("aria-selected") === "true")
      ?.dataset["value"] ?? "none"
  );
}

describe("selectionAfterClose", () => {
  it("returns the selected value when another tab closes", () => {
    expect(selectionAfterClose(["a", "b", "c"], "b", "a")).toBe("b");
  });

  it("returns the next value when the selected tab closes", () => {
    expect(selectionAfterClose(["a", "b", "c"], "b", "b")).toBe("c");
  });

  it("returns the previous value when the selected last tab closes", () => {
    expect(selectionAfterClose(["a", "b", "c"], "c", "c")).toBe("b");
  });

  it("returns null when the only tab closes", () => {
    expect(selectionAfterClose(["a"], "a", "a")).toBeNull();
  });

  it("returns null when nothing is selected", () => {
    expect(selectionAfterClose(["a", "b"], null, "a")).toBeNull();
  });
});

describe("closeTab", () => {
  it("selects the next enabled tab when the selected tab closes", async () => {
    await drawn(closable());
    await closed("second");

    expect(selected()).toBe("fourth");
  });

  it("selects the previous tab when the selected last tab closes", async () => {
    await drawn(closable({ defaultValue: "fourth" }));
    await closed("fourth");

    expect(selected()).toBe("second");
  });

  it("clears the selection when the only tab closes", async () => {
    const onValueChange = vi.fn<(details: { readonly value: null | string }) => void>();

    await drawn(closable({ defaultValue: "first", onValueChange }, ["first"]));
    await closed("first");

    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: null }));
  });

  it("keeps the selection when another tab closes", async () => {
    await drawn(closable());
    await closed("first");

    expect(selected()).toBe("second");
  });

  it("removes the closed tab through onClose", async () => {
    await drawn(closable());
    await closed("first");

    expect(screen.queryByRole("tab", { name: "first" })).toBeNull();
  });

  it("calls onClose with the closed value", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    await closed("first");

    expect(onClose).toHaveBeenCalledExactlyOnceWith({ value: "first" });
  });

  it("calls onValueChange before onClose", async () => {
    const heard: string[] = [];

    await drawn(
      closable({
        onClose: () => {
          heard.push("close");
        },
        onValueChange: () => {
          heard.push("value");
        },
      }),
    );
    await closed("second");

    expect(heard).toStrictEqual(["value", "close"]);
  });

  it("calls no onValueChange when another tab closes", async () => {
    const onValueChange = vi.fn<() => void>();

    await drawn(closable({ onValueChange }));
    await closed("first");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("moves focus to the next enabled tab when the focused tab closes", async () => {
    await drawn(closable());
    act(() => {
      tab("second").focus();
    });
    await closed("second");

    expect(document.activeElement).toBe(tab("fourth"));
  });

  it("selects the next enabled tab when the focused selected tab closes under deselectable", async () => {
    await drawn(closable({ deselectable: true }));
    act(() => {
      tab("second").focus();
    });
    await closed("second");

    expect(selected()).toBe("fourth");
  });

  it("leaves focus where it is when a tab without focus closes", async () => {
    await drawn(closable());
    act(() => {
      tab("second").focus();
    });
    await closed("first");

    expect(document.activeElement).toBe(tab("second"));
  });

  it("leaves a disabled tab open", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    await closed("third");

    expect(onClose).not.toHaveBeenCalled();
  });
});
