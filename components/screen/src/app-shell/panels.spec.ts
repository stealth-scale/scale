import { describe, expect, it } from "vitest";

import { type Panel, panelStore } from "#app-shell/panels.ts";

/**
 * Builds a navbar panel state with the given open state.
 *
 * @param open - Whether the panel is shown.
 * @returns The panel state.
 */
function panelOf(open: boolean): Panel {
  return { id: "navbar", open, overlaid: false, setOpen: () => {}, stacked: false };
}

describe("panelStore", () => {
  it("starts empty", () => {
    expect(panelStore().read()).toStrictEqual({});
  });

  it("stores a panel under its name", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));

    expect(store.read()["navbar"]?.open).toBe(true);
  });

  it("removes a panel published without state", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));
    store.publish("navbar");

    expect(store.read()).toStrictEqual({});
  });

  it("notifies a subscriber when a panel changes", () => {
    const store = panelStore();
    let told = 0;

    store.subscribe(() => {
      told += 1;
    });
    store.publish("navbar", panelOf(true));

    expect(told).toBe(1);
  });

  it("notifies nobody when a panel publishes an equal state", () => {
    const store = panelStore();
    const same = panelOf(true);
    let told = 0;

    store.publish("navbar", same);
    store.subscribe(() => {
      told += 1;
    });
    store.publish("navbar", { ...same });

    expect(told).toBe(0);
  });

  it("returns the same object until a panel changes", () => {
    const store = panelStore();
    const same = panelOf(true);

    store.publish("navbar", same);

    const first = store.read();

    store.publish("navbar", { ...same });

    expect(store.read()).toBe(first);
  });

  it("stops notifying an unsubscribed listener", () => {
    const store = panelStore();
    let told = 0;

    store.subscribe(() => {
      told += 1;
    })();
    store.publish("navbar", panelOf(true));

    expect(told).toBe(0);
  });

  it("stores each panel under its own name", () => {
    const store = panelStore();

    store.publish("navbar", panelOf(true));
    store.publish("aside", panelOf(false));

    expect(Object.keys(store.read()).toSorted()).toStrictEqual(["aside", "navbar"]);
  });
});
