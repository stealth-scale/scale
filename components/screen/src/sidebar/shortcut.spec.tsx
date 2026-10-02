import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { keysOf, useShortcut } from "#sidebar/shortcut.ts";

/**
 * Runs an action on a shortcut, and renders nothing.
 */
function Listener({
  run,
  shortcut,
}: {
  readonly run: () => void;
  readonly shortcut: string | undefined;
}): null {
  useShortcut(shortcut, run);

  return null;
}

/**
 * Renders the listener with a mock action and returns the action.
 */
function listening(shortcut?: string): () => void {
  const run = vi.fn<() => void>();
  const element: ReactElement = <Listener run={run} shortcut={shortcut} />;

  render(element);

  return run;
}

describe("shortcut", () => {
  it("returns the key with Control and with Meta", () => {
    expect(keysOf("k")).toBe("Control+K Meta+K");
  });

  it("returns no value without a shortcut", () => {
    expect(keysOf()).toBeUndefined();
  });

  it("runs the action on the key with Meta", () => {
    const run = listening("k");

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(run).toHaveBeenCalledOnce();
  });

  it("runs the action on the key with Control", () => {
    const run = listening("k");

    fireEvent.keyDown(document, { ctrlKey: true, key: "k" });

    expect(run).toHaveBeenCalledOnce();
  });

  it("stops the browser's own use of the keys", () => {
    listening("k");

    expect(fireEvent.keyDown(document, { key: "k", metaKey: true })).toBe(false);
  });

  it("ignores the key without a modifier", () => {
    const run = listening("k");

    fireEvent.keyDown(document, { key: "k" });

    expect(run).not.toHaveBeenCalled();
  });

  it("ignores every key without a shortcut", () => {
    const run = listening();

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(run).not.toHaveBeenCalled();
  });

  it("stops listening when it unmounts", () => {
    const run = vi.fn<() => void>();
    const { unmount } = render(<Listener run={run} shortcut="k" />);

    unmount();
    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(run).not.toHaveBeenCalled();
  });
});
