import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settledTasks } from "#commands/commands.fixtures.ts";
import { received } from "#host/host.fixtures.ts";
import { internalsOf } from "#host/internals.ts";
import { useConnected } from "#parts/connect.ts";
import { loadedAt, quarantined, routedAt } from "#parts/parts.fixtures.tsx";
import { CONDITIONED } from "#routes/routes.fixtures.ts";
import { CALENDAR, flagging, LAYOUT } from "#stores/flags.fixtures.ts";
import { ADA, switchable } from "#stores/session.fixtures.ts";

describe("useConnected", () => {
  it("connects the host with the routes the router matched", async () => {
    const { host, router } = await loadedAt("/time-off/7");
    const connect = vi.spyOn(internalsOf(host), "connect");

    renderHook(() => {
      useConnected(host, router);
    });

    expect(connect.mock.lastCall?.[0].matched()).toStrictEqual([
      "time-off/overview",
      "time-off/request",
    ]);
  });

  it("disconnects the host as it unmounts", async () => {
    const { host, router } = await loadedAt("/time-off");
    const disconnect = vi.fn<() => void>();

    vi.spyOn(internalsOf(host), "connect").mockReturnValue(disconnect);

    const { unmount } = renderHook(() => {
      useConnected(host, router);
    });

    unmount();

    expect(disconnect).toHaveBeenCalledExactlyOnceWith();
  });

  it("runs beforeLoad again after a switch turns a plugin off", async () => {
    const { host, router } = await loadedAt("/time-off");
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      internalsOf(host).switches.set("billing", false);
      await settledTasks();
    });

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("runs beforeLoad again after the session changes", async () => {
    const session = switchable(ADA);
    const { host, router } = await loadedAt("/time-off", { session });
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      session.change({ ...ADA, displayName: "Ada Lovelace" });
      await settledTasks();
    });

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("runs beforeLoad again once for every change of one task", async () => {
    const session = switchable(ADA);
    const { host, router } = await loadedAt("/time-off", { product: CONDITIONED, session });
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      session.change({ ...ADA, authenticated: false });
      await settledTasks();
    });

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("runs beforeLoad again after a page is quarantined", async () => {
    const { host, router } = await loadedAt("/time-off");
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      quarantined(host);
      await settledTasks();
    });

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("leaves the router alone after the first reads of flags", async () => {
    const { host, router } = await loadedAt("/time-off");
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      host.stores.flags.read(CALENDAR);
      await settledTasks();
      host.stores.flags.read(LAYOUT);
      await settledTasks();
    });

    expect(invalidate).not.toHaveBeenCalled();
  });

  it("runs beforeLoad again after the flag source changes a value the page read", async () => {
    const flags = flagging({ [CALENDAR]: false }, false);
    const { host, router } = await loadedAt("/time-off", { flags: flags.source });
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      host.stores.flags.read(CALENDAR);
      await settledTasks();
      flags.change(CALENDAR, true);
      await settledTasks();
    });

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("runs beforeLoad again after an override", async () => {
    const { host, router } = await loadedAt("/time-off");
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue();

    renderHook(() => {
      useConnected(host, router);
    });

    try {
      await act(async () => {
        host.stores.flags.override(CALENDAR, true);
        await settledTasks();
      });

      expect(invalidate).toHaveBeenCalledExactlyOnceWith();
    } finally {
      host.stores.flags.override(CALENDAR);
    }
  });

  it("emits host/navigated for the address resolved before it mounts", async () => {
    const { host, router } = await loadedAt("/time-off/7");
    const navigated = received(internalsOf(host).runtime.events, "host/navigated");

    renderHook(() => {
      useConnected(host, router);
    });

    expect(navigated).toStrictEqual([
      { href: "/time-off/7", matched: ["time-off/overview", "time-off/request"] },
    ]);
  });

  it("emits host/navigated once the first load resolves after it mounts", async () => {
    const { host, router } = routedAt("/time-off/7");
    const navigated = received(internalsOf(host).runtime.events, "host/navigated");

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      await router.load();
    });

    expect(navigated).toStrictEqual([
      { href: "/time-off/7", matched: ["time-off/overview", "time-off/request"] },
    ]);
  });

  it("emits host/navigated after a navigation the router resolves", async () => {
    const { host, router } = await loadedAt("/time-off");
    const navigated = received(internalsOf(host).runtime.events, "host/navigated");

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      await router.navigate({ to: "/invoices" });
    });

    expect(navigated.at(-1)).toStrictEqual({ href: "/invoices", matched: ["billing/invoices"] });
  });

  it("reloads the page on Vite's preload error", async () => {
    const { host, router } = await loadedAt("/time-off");
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});

    renderHook(() => {
      useConnected(host, router);
    });

    try {
      window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));

      expect(reload).toHaveBeenCalledExactlyOnceWith();
    } finally {
      sessionStorage.removeItem("stealth.people.reloaded");
    }
  });

  it("emits nothing for a load of the address the router resolved", async () => {
    const { host, router } = await loadedAt("/time-off");
    const navigated = received(internalsOf(host).runtime.events, "host/navigated");

    renderHook(() => {
      useConnected(host, router);
    });
    await act(async () => {
      await router.invalidate();
    });

    expect(navigated).toHaveLength(1);
  });
});
