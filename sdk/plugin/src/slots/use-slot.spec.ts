import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { routedWrapper } from "#host/routed.fixtures.tsx";
import { extensionIn, FED, feedContract } from "#slots/feed.fixtures.ts";
import { idsOf } from "#slots/slots.fixtures.ts";
import { useSlot } from "#slots/use-slot.ts";

describe("useSlot", () => {
  it("returns the extensions a slot renders", async () => {
    const { result } = renderHook(() => useSlot(feedContract.slots.panel), {
      wrapper: await routedWrapper(fixtureHost({ product: FED })),
    });

    expect(idsOf(result.current.rendered)).toStrictEqual([
      "notes/border",
      "notes/lead",
      "notes/tail",
    ]);
  });

  it("returns filled where an extension renders", async () => {
    const { result } = renderHook(() => useSlot(feedContract.slots.panel), {
      wrapper: await routedWrapper(fixtureHost({ product: FED })),
    });

    expect(result.current.filled).toBe(true);
  });

  it("returns filled where a page contribution renders alone", async () => {
    const host = fixtureHost({ product: FED });

    host.pages.set(new Map([["feed/item", [{ content: "title", key: "a", order: 0 }]]]));

    const { result } = renderHook(() => useSlot(feedContract.slots.item), {
      wrapper: await routedWrapper(host),
    });

    expect(result.current.filled).toBe(true);
  });

  it("returns not filled where nothing renders", async () => {
    const { result } = renderHook(() => useSlot(feedContract.slots.item), {
      wrapper: await routedWrapper(fixtureHost({ product: FED })),
    });

    expect(result.current.filled).toBe(false);
  });

  it("returns the extensions for the match of a keyed slot", async () => {
    const { result } = renderHook(() => useSlot(feedContract.slots.item, "book"), {
      wrapper: await routedWrapper(fixtureHost({ product: FED })),
    });

    expect(idsOf(result.current.rendered)).toStrictEqual(["notes/book"]);
  });

  it("drops an extension with a condition on the slot's record", async () => {
    const { result } = renderHook(() => useSlot(feedContract.slots.item, "book"), {
      wrapper: await routedWrapper(fixtureHost({ product: FED })),
    });

    expect(result.current.dropped).toStrictEqual([
      { extension: extensionIn(FED, "notes/restock"), reason: "condition" },
    ]);
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useSlot(feedContract.slots.panel))).toThrow(
      "useSlot() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
