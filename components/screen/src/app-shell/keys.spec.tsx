import { type ReactElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Keyed, useKeys } from "#app-shell/keys.ts";

/**
 * States the listener's setter was called with, in order.
 */
const told: string[] = [];

/**
 * Registers the key listener with a setter that records each call.
 *
 * @param props - The panel state, without the setter.
 * @returns A text field, so a case can press a key inside it.
 */
function Listener(props: Omit<Keyed, "setOpen">): ReactElement {
  useKeys({
    ...props,
    setOpen: (open) => {
      told.push(open ? "open" : "closed");
    },
  });

  return <input aria-label="Search" />;
}

describe("useKeys", () => {
  it("closes an open panel over the page on Escape", () => {
    told.length = 0;
    render(<Listener open overlaid shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual(["closed"]);
  });

  it("ignores Escape for a panel beside the page", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });

  it("ignores Escape for a closed panel over the page", () => {
    told.length = 0;
    render(<Listener open={false} overlaid shortcut={undefined} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });

  it("opens a closed panel on its shortcut with Control", () => {
    told.length = 0;
    render(<Listener open={false} overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { ctrlKey: true, key: "b" });

    expect(told).toStrictEqual(["open"]);
  });

  it("closes an open panel on its shortcut with Command", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { key: "b", metaKey: true });

    expect(told).toStrictEqual(["closed"]);
  });

  it("ignores the shortcut key without a modifier", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut="b" />);

    fireEvent.keyDown(document, { key: "b" });

    expect(told).toStrictEqual([]);
  });

  it("handles Escape pressed inside a text field", () => {
    told.length = 0;
    render(<Listener open overlaid shortcut={undefined} />);

    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });

    expect(told).toStrictEqual(["closed"]);
  });

  it("ignores a chord when no shortcut is set", () => {
    told.length = 0;
    render(<Listener open overlaid={false} shortcut={undefined} />);

    fireEvent.keyDown(document, { ctrlKey: true, key: "b" });

    expect(told).toStrictEqual([]);
  });

  it("removes the listener on unmount", () => {
    told.length = 0;

    const { unmount } = render(<Listener open overlaid shortcut={undefined} />);

    unmount();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(told).toStrictEqual([]);
  });
});
