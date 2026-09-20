import { type ReactElement } from "react";

import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fragmentsOf, type Update, UPDATED, useUpdated } from "#catalogue/updated.ts";

function Listening({
  id,
  onUpdate,
}: {
  readonly id: string;
  readonly onUpdate: (update: Update) => void;
}): ReactElement {
  useUpdated(id, onUpdate);

  return <output />;
}

/**
 * Dispatches an event on the window, as the index does.
 */
function dispatched(name: string, detail: unknown): void {
  act(() => {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  });
}

describe("UPDATED", () => {
  it("names the event the index dispatches", () => {
    expect(UPDATED).toBe("specimen:updated");
  });
});

describe("useUpdated", () => {
  it("tells the listener an update of its page", () => {
    const onUpdate = vi.fn<(update: Update) => void>();

    render(<Listening id="data/badge" onUpdate={onUpdate} />);
    dispatched(UPDATED, { id: "data/badge", module: { default: {} } });

    expect(onUpdate).toHaveBeenCalledWith({ id: "data/badge", module: { default: {} } });
  });

  it("leaves an update of another page and anything that is no update alone", () => {
    const onUpdate = vi.fn<(update: Update) => void>();

    render(<Listening id="data/badge" onUpdate={onUpdate} />);
    dispatched(UPDATED, { id: "data/chip", module: {} });
    dispatched(UPDATED, "data/badge");
    dispatched(UPDATED, { module: {} });
    act(() => {
      window.dispatchEvent(new Event(UPDATED));
    });

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("stops listening when the page has left the screen", () => {
    const onUpdate = vi.fn<(update: Update) => void>();
    const { unmount } = render(<Listening id="data/badge" onUpdate={onUpdate} />);

    unmount();
    dispatched(UPDATED, { id: "data/badge", module: {} });

    expect(onUpdate).not.toHaveBeenCalled();
  });
});

describe("fragmentsOf", () => {
  it("reads the fragments and the imported names out of a module loaded again", () => {
    expect(fragmentsOf({ fragments: { Sizes: "a" }, imported: ["Badge"] })).toStrictEqual({
      fragments: { Sizes: "a" },
      imported: ["Badge"],
    });
  });

  it("answers nothing for a module of another shape", () => {
    expect(fragmentsOf(null)).toBeUndefined();
    expect(fragmentsOf({ fragments: {} })).toBeUndefined();
    expect(fragmentsOf({ fragments: "a", imported: [] })).toBeUndefined();
    expect(fragmentsOf({ fragments: {}, imported: "Badge" })).toBeUndefined();
  });
});
