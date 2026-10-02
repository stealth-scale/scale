import { describe, expect, it, vi } from "vitest";

import { ASIDE, FIRST, SECOND } from "#stores/mounted.fixtures.ts";
import { createMountedStore } from "#stores/mounted.ts";

describe("createMountedStore", () => {
  it("records a mounted instance", () => {
    const store = createMountedStore();

    store.mount(ASIDE, FIRST);

    expect(store.get().get(ASIDE)).toStrictEqual([FIRST]);
  });

  it("records every instance of a slot in mount order", () => {
    const store = createMountedStore();

    store.mount(ASIDE, FIRST);
    store.mount(ASIDE, SECOND);

    expect(store.get().get(ASIDE)).toStrictEqual([FIRST, SECOND]);
  });

  it("removes an instance once it unmounts", () => {
    const store = createMountedStore();
    const unmount = store.mount(ASIDE, FIRST);

    store.mount(ASIDE, SECOND);
    unmount();

    expect(store.get().get(ASIDE)).toStrictEqual([SECOND]);
  });

  it("removes a slot whose last instance unmounts", () => {
    const store = createMountedStore();

    store.mount(ASIDE, FIRST)();

    expect(store.get().has(ASIDE)).toBe(false);
  });

  it("calls no listener for a second unmount", () => {
    const store = createMountedStore();
    const unmount = store.mount(ASIDE, FIRST);
    const listener = vi.fn<() => void>();

    unmount();
    store.subscribe(listener);
    unmount();

    expect(listener).not.toHaveBeenCalled();
  });
});
