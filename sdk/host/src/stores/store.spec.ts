import { describe, expect, it, vi } from "vitest";

import { writable } from "#stores/store.ts";

describe("writable", () => {
  it("returns the initial value", () => {
    expect(writable(1).get()).toBe(1);
  });

  it("returns the value set last", () => {
    const store = writable(1);

    store.set(2);

    expect(store.get()).toBe(2);
  });

  it("calls every listener after a change", () => {
    const store = writable(1);
    const first = vi.fn<() => void>();
    const second = vi.fn<() => void>();

    store.subscribe(first);
    store.subscribe(second);
    store.set(2);

    expect([first.mock.calls.length, second.mock.calls.length]).toStrictEqual([1, 1]);
  });

  it("calls no listener when the same value is set again", () => {
    const store = writable({ on: true });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    store.set(store.get());

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops calling a listener once it unsubscribes", () => {
    const store = writable(1);
    const listener = vi.fn<() => void>();

    store.subscribe(listener)();
    store.set(2);

    expect(listener).not.toHaveBeenCalled();
  });

  it("calls a listener that another listener adds from the next change on", () => {
    const store = writable(1);
    const late = vi.fn<() => void>();

    store.subscribe(() => {
      store.subscribe(late);
    });
    store.set(2);

    expect(late).not.toHaveBeenCalled();
  });
});
