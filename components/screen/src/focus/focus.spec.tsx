import { type ReactElement, type RefObject, useRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFocused } from "#focus/focus.ts";

/**
 * Describes the props of the sheet under test.
 */
interface SheetProps {
  /**
   * Control that had focus when the sheet opened, when a case records it.
   */
  readonly from?: RefObject<HTMLElement | null> | undefined;

  /**
   * Selector of the element that receives focus, or null to move none.
   */
  readonly into?: null | string | undefined;

  /**
   * Whether the sheet is open.
   */
  readonly shown: boolean;
}

/**
 * Renders a sheet that takes focus, the control that opens it and a control beside them.
 *
 * @param props - Whether the sheet is open, where focus goes, and the control that had focus.
 * @returns The two controls and the sheet.
 */
function Sheet({ from, into, shown }: SheetProps): ReactElement {
  const inner = useRef<HTMLDivElement>(null);

  useFocused(inner, shown, into, from);

  return (
    <>
      <button type="button">Navigation</button>
      <button type="button">Account</button>
      <div data-testid="sheet" ref={inner} tabIndex={-1}>
        <a href="/invoices">Invoices</a>
      </div>
    </>
  );
}

describe("useFocused", () => {
  it("leaves focus on the document while the sheet is hidden", () => {
    render(<Sheet shown={false} />);

    expect(document.activeElement).toBe(document.body);
  });

  it("focuses the sheet when it opens", () => {
    render(<Sheet shown />);

    expect(document.activeElement).toBe(screen.getByTestId("sheet"));
  });

  it("keeps focus on an element inside the sheet when it opens", () => {
    const { rerender } = render(<Sheet shown={false} />);

    screen.getByRole("link", { name: "Invoices" }).focus();
    rerender(<Sheet shown />);

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("focuses the control that opened the sheet when it closes", () => {
    const { rerender } = render(<Sheet shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet shown />);
    rerender(<Sheet shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("restores no focus when no element had focus as the sheet opened", () => {
    const { rerender } = render(<Sheet shown={false} />);

    Object.defineProperty(document, "activeElement", { configurable: true, value: null });
    rerender(<Sheet shown />);
    Reflect.deleteProperty(document, "activeElement");
    rerender(<Sheet shown={false} />);

    expect(document.activeElement).toBe(screen.getByTestId("sheet"));
  });

  it("focuses the control passed as from when the sheet closes", () => {
    const remembered = { current: null } as { current: HTMLElement | null };
    const { rerender } = render(<Sheet shown={false} />);

    remembered.current = screen.getByRole("button", { name: "Navigation" });
    rerender(<Sheet from={remembered} shown />);
    rerender(<Sheet from={remembered} shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("restores no focus when the control that opened the sheet has left the document", () => {
    const { rerender, unmount } = render(<Sheet shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet shown />);
    unmount();

    expect(document.activeElement).toBe(document.body);
  });

  it("focuses the element into names when the sheet opens", () => {
    render(<Sheet into="a" shown />);

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("leaves focus on the opening control when into is null", () => {
    const { rerender } = render(<Sheet into={null} shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet into={null} shown />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("returns focus from inside the sheet when into is null", () => {
    const { rerender } = render(<Sheet into={null} shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet into={null} shown />);
    screen.getByRole("link", { name: "Invoices" }).focus();
    rerender(<Sheet into={null} shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("leaves focus on the control the reader moved to before the sheet closed", () => {
    const { rerender } = render(<Sheet shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet shown />);
    screen.getByRole("button", { name: "Account" }).focus();
    rerender(<Sheet shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Account" }));
  });
});
