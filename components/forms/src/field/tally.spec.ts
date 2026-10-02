import { describe, expect, it, vi } from "vitest";

import { tally } from "#field/tally.ts";

describe("tally", () => {
  it("starts at a length of 0", () => {
    expect(tally().get()).toBe(0);
  });

  it("returns the length last written", () => {
    const store = tally();

    store.set(12);

    expect(store.get()).toBe(12);
  });

  it("notifies a subscriber when the length changes", () => {
    const store = tally();
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    store.set(3);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies no one when the length is written unchanged", () => {
    const store = tally();
    const listener = vi.fn<() => void>();

    store.set(3);
    store.subscribe(listener);
    store.set(3);

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying a listener once it unsubscribes", () => {
    const store = tally();
    const listener = vi.fn<() => void>();

    store.subscribe(listener)();
    store.set(3);

    expect(listener).not.toHaveBeenCalled();
  });
});
