import { describe, expect, it, vi } from "vitest";

import { refusedStorage, withoutWindow } from "#host/host.fixtures.ts";
import { reloadedBefore, reloads, VERSION } from "#recovery/recovery.fixtures.ts";
import { listenForStaleChunks, staleRecovery } from "#recovery/stale.ts";

describe("stale", () => {
  it("reloads the page on the first failed import of a build version", () => {
    const reload = reloads();

    expect(staleRecovery({ productId: "first", version: VERSION })()).toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it("records the build version under the product's key before it reloads", () => {
    reloads();
    staleRecovery({ productId: "recorded", version: VERSION })();

    expect(sessionStorage.getItem("stealth.recorded.reloaded")).toBe(VERSION);
  });

  it("returns true without a second reload while the page reloads", () => {
    const reload = reloads();
    const recover = staleRecovery({ productId: "reloading", version: VERSION });

    recover();

    expect(recover()).toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it("returns false for a build version it reloaded before", () => {
    const reload = reloads();

    reloadedBefore("again");

    expect(staleRecovery({ productId: "again", version: VERSION })()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("reloads the page for a build version other than the one recorded", () => {
    const reload = reloads();

    reloadedBefore("newer");

    expect(staleRecovery({ productId: "newer", version: "2026.10.2" })()).toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it("returns false on a server", () => {
    withoutWindow();

    try {
      expect(staleRecovery({ productId: "server", version: VERSION })()).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns false where the browser refuses the storage", () => {
    const reload = reloads();
    const restore = refusedStorage();

    try {
      expect(staleRecovery({ productId: "refused", version: VERSION })()).toBe(false);
      expect(reload).not.toHaveBeenCalled();
    } finally {
      restore();
    }
  });

  it("cancels Vite's preload error where the page reloads", () => {
    const event = new Event("vite:preloadError", { cancelable: true });
    const stop = listenForStaleChunks(() => true);

    window.dispatchEvent(event);
    stop();

    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves Vite's preload error to reject the import where the page does not reload", () => {
    const event = new Event("vite:preloadError", { cancelable: true });
    const stop = listenForStaleChunks(() => false);

    window.dispatchEvent(event);
    stop();

    expect(event.defaultPrevented).toBe(false);
  });

  it("stops listening once its stop function runs", () => {
    const recover = vi.fn<() => boolean>(() => true);

    listenForStaleChunks(recover)();
    window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));

    expect(recover).not.toHaveBeenCalled();
  });
});
