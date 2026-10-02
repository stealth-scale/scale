import { describe, expect, it, vi } from "vitest";

import { HEADER } from "#stores/pages.fixtures.ts";
import { createPageStore } from "#stores/pages.ts";

describe("createPageStore", () => {
  it("places a contribution with no content", () => {
    const store = createPageStore();

    store.place(HEADER, "title", 0);

    expect(store.get().get(HEADER)).toStrictEqual([{ content: null, key: "title", order: 0 }]);
  });

  it("fills a contribution's content in its place", () => {
    const store = createPageStore();

    store.place(HEADER, "title", 0);
    store.fill("title", "Requests");

    expect(store.get().get(HEADER)).toStrictEqual([
      { content: "Requests", key: "title", order: 0 },
    ]);
  });

  it("ignores a fill for a key no contribution has", () => {
    const store = createPageStore();

    store.fill("title", "Requests");

    expect(store.get().size).toBe(0);
  });

  it("calls no listener for a fill with the content it has", () => {
    const store = createPageStore();
    const listener = vi.fn<() => void>();

    store.place(HEADER, "title", 0);
    store.fill("title", "Requests");
    store.subscribe(listener);
    store.fill("title", "Requests");

    expect(listener).not.toHaveBeenCalled();
  });

  it("lists a slot's contributions by order", () => {
    const store = createPageStore();

    store.place(HEADER, "actions", 2);
    store.place(HEADER, "title", 1);

    expect(
      store
        .get()
        .get(HEADER)
        ?.map(({ key }) => key),
    ).toStrictEqual(["title", "actions"]);
  });

  it("lists contributions of one order in the order they were placed", () => {
    const store = createPageStore();

    store.place(HEADER, "title", 0);
    store.place(HEADER, "actions", 0);

    expect(
      store
        .get()
        .get(HEADER)
        ?.map(({ key }) => key),
    ).toStrictEqual(["title", "actions"]);
  });

  it("removes a contribution once it leaves", () => {
    const store = createPageStore();

    store.place(HEADER, "title", 0)();

    expect(store.get().has(HEADER)).toBe(false);
  });

  it("keeps a later placement of a key when an earlier one leaves", () => {
    const store = createPageStore();
    const leave = store.place(HEADER, "title", 0);

    store.place(HEADER, "title", 1);
    leave();

    expect(store.get().get(HEADER)).toStrictEqual([{ content: null, key: "title", order: 1 }]);
  });

  it("calls no listener for a second leave", () => {
    const store = createPageStore();
    const leave = store.place(HEADER, "title", 0);
    const listener = vi.fn<() => void>();

    leave();
    store.subscribe(listener);
    leave();

    expect(listener).not.toHaveBeenCalled();
  });
});
