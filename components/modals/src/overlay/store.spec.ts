import { describe, expect, it, vi } from "vitest";

import { stateOf } from "#overlay/store.fixtures.ts";
import { createStore } from "#overlay/store.ts";

/**
 * Describes the props the cases open overlays with.
 */
interface Named {
  /**
   * Name the overlay shows.
   */
  readonly name: string;

  /**
   * Share of an upload the overlay shows.
   */
  readonly progress?: number;
}

describe("createStore", () => {
  it("keeps no entry before an overlay opens", () => {
    expect(createStore<Named, string>().entries()).toStrictEqual([]);
  });

  it("keeps an open entry under the id open names", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    expect(store.entries()).toStrictEqual([
      expect.objectContaining({ id: "rename", open: true, props: { name: "Quarterly" } }),
    ]);
  });

  it("resolves open with the result close passes", async () => {
    const store = createStore<Named, string>();
    const answer = store.open("rename", { name: "Quarterly" });

    void store.close("rename", "Annual");

    await expect(answer).resolves.toBe("Annual");
  });

  it("keeps the first result when close is called twice", async () => {
    const store = createStore<Named, string>();
    const answer = store.open("rename", { name: "Quarterly" });

    void store.close("rename", "Annual");
    void store.close("rename", "Monthly");

    await expect(answer).resolves.toBe("Annual");
  });

  it("keeps a closed entry until remove is called", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.close("rename");

    expect(store.entries()).toStrictEqual([expect.objectContaining({ open: false })]);
  });

  it("keeps a closed entry in its place in the list", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.open("share", { name: "Annual" });
    void store.close("rename");

    expect(store.entries().map((entry) => entry.id)).toStrictEqual(["rename", "share"]);
  });

  it("resolves close once the entry is removed", async () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const left = store.close("rename");

    await expect(stateOf(left)).resolves.toBe("pending");

    store.remove("rename");

    await expect(stateOf(left)).resolves.toBe("settled");
  });

  it("resolves the promise of every close once the entry is removed", async () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const first = store.close("rename");
    const second = store.close("rename");

    store.remove("rename");

    await expect(Promise.all([stateOf(first), stateOf(second)])).resolves.toStrictEqual([
      "settled",
      "settled",
    ]);
  });

  it("resolves close at once for an id the store does not keep", async () => {
    await expect(stateOf(createStore<Named, string>().close("rename"))).resolves.toBe("settled");
  });

  it("resolves open with undefined when remove is called", async () => {
    const store = createStore<Named, string>();
    const answer = store.open("rename", { name: "Quarterly" });

    store.remove("rename");

    await expect(answer).resolves.toBeUndefined();
  });

  it("ignores remove for an id the store does not keep", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const kept = store.entries();

    store.remove("share");

    expect(store.entries()).toBe(kept);
  });

  it("resolves the earlier open with undefined when the id is opened again", async () => {
    const store = createStore<Named, string>();
    const earlier = store.open("rename", { name: "Quarterly" });

    void store.open("rename", { name: "Annual" });

    await expect(earlier).resolves.toBeUndefined();
  });

  it("resolves the earlier close when the id is opened again", async () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const left = store.close("rename");

    void store.open("rename", { name: "Annual" });

    await expect(stateOf(left)).resolves.toBe("settled");
  });

  it("opens the entry again in its place with the new props when the id is opened again", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.open("share", { name: "Monthly" });
    void store.close("rename");
    void store.open("rename", { name: "Annual" });

    expect(store.entries()).toStrictEqual([
      expect.objectContaining({ id: "rename", open: true, props: { name: "Annual" } }),
      expect.objectContaining({ id: "share" }),
    ]);
  });

  it("settles the new open with the result close passes after the id is opened again", async () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const answer = store.open("rename", { name: "Annual" });

    void store.close("rename", "Monthly");

    await expect(answer).resolves.toBe("Monthly");
  });

  it("merges the props update passes into the entry", () => {
    const store = createStore<Named, string>();

    void store.open("upload", { name: "Report", progress: 0 });
    store.update("upload", { progress: 40 });

    expect(store.get("upload")).toStrictEqual({ name: "Report", progress: 40 });
  });

  it("keeps an entry open when update is called", () => {
    const store = createStore<Named, string>();

    void store.open("upload", { name: "Report", progress: 0 });
    store.update("upload", { progress: 40 });

    expect(store.has("upload")).toBe(true);
  });

  it("ignores update for an id the store does not keep", () => {
    const store = createStore<Named, string>();
    const kept = store.entries();

    store.update("upload", { progress: 40 });

    expect(store.entries()).toBe(kept);
  });

  it("throws when get names an id the store does not keep", () => {
    expect(() => createStore<Named, string>().get("rename")).toThrow(
      'No overlay is kept under the id "rename".',
    );
  });

  it("returns the props of every entry from getSnapshot in the order their ids were opened", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.open("share", { name: "Annual" });

    expect(store.getSnapshot()).toStrictEqual([{ name: "Quarterly" }, { name: "Annual" }]);
  });

  it("returns true from has while the entry plays its exit", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.close("rename");

    expect(store.has("rename")).toBe(true);
  });

  it("returns false from has once the entry is removed", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    store.remove("rename");

    expect(store.has("rename")).toBe(false);
  });

  it("removes every entry when removeAll is called", () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });
    void store.open("share", { name: "Annual" });
    store.removeAll();

    expect(store.entries()).toStrictEqual([]);
  });

  it("resolves every open with undefined when removeAll is called", async () => {
    const store = createStore<Named, string>();
    const answers = [
      store.open("rename", { name: "Quarterly" }),
      store.open("share", { name: "Annual" }),
    ];

    store.removeAll();

    await expect(Promise.all(answers)).resolves.toStrictEqual([undefined, undefined]);
  });

  it("resolves waitForExit once the entry is removed", async () => {
    const store = createStore<Named, string>();

    void store.open("rename", { name: "Quarterly" });

    const left = store.waitForExit("rename");

    await expect(stateOf(left)).resolves.toBe("pending");

    store.remove("rename");

    await expect(stateOf(left)).resolves.toBe("settled");
  });

  it("resolves waitForExit at once for an id the store does not keep", async () => {
    await expect(stateOf(createStore<Named, string>().waitForExit("rename"))).resolves.toBe(
      "settled",
    );
  });

  it("calls a listener after every change to the entries", () => {
    const store = createStore<Named, string>();
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    void store.open("rename", { name: "Quarterly" });
    void store.close("rename");
    store.remove("rename");

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("stops calling a listener once its subscription is ended", () => {
    const store = createStore<Named, string>();
    const listener = vi.fn<() => void>();

    store.subscribe(listener)();
    void store.open("rename", { name: "Quarterly" });

    expect(listener).not.toHaveBeenCalled();
  });
});
