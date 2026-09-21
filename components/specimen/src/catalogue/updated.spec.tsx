import { type ReactElement } from "react";

import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UPDATED as DISPATCHED } from "@stealthscale/vite-plugin-specimen";

import { type Update, UPDATED, useUpdated } from "#catalogue/updated.ts";

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
    expect(UPDATED).toBe(DISPATCHED);
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

  it("listens once however often the page renders with a listener written afresh", () => {
    const added = vi.spyOn(window, "addEventListener");
    const { rerender } = render(<Listening id="data/badge" onUpdate={() => {}} />);

    rerender(<Listening id="data/badge" onUpdate={() => {}} />);
    rerender(<Listening id="data/badge" onUpdate={() => {}} />);

    expect(added.mock.calls.filter(([name]) => name === UPDATED)).toHaveLength(1);
    added.mockRestore();
  });

  it("tells the listener written last", () => {
    const first = vi.fn<(update: Update) => void>();
    const last = vi.fn<(update: Update) => void>();
    const { rerender } = render(<Listening id="data/badge" onUpdate={first} />);

    rerender(<Listening id="data/badge" onUpdate={last} />);
    dispatched(UPDATED, { id: "data/badge", module: {} });

    expect(first).not.toHaveBeenCalled();
    expect(last).toHaveBeenCalledWith({ id: "data/badge", module: {} });
  });
});
