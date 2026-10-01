import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { type RenderTarget } from "#host/report.ts";
import { type Quarantined } from "#host/stores.ts";
import { disabledIn, extensionIn, FED, statusIn } from "#slots/feed.fixtures.ts";
import { useExtensionStatuses } from "#slots/statuses.ts";

describe("useExtensionStatuses", () => {
  it("returns one status per extension in install order", () => {
    const { result } = renderHook(() => useExtensionStatuses(), {
      wrapper: wrapperOf(fixtureHost({ product: FED })),
    });

    expect(result.current.map(({ extension }) => extension.id)).toStrictEqual(
      FED.extensions.map(({ id }) => id),
    );
  });

  it("returns an extension a mounted slot renders as placed", () => {
    const host = fixtureHost({ product: FED });

    host.mounted.set(new Map([["feed/panel", [{ dropped: {}, rendered: ["notes/tail"] }]]]));

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/tail")).toStrictEqual({
      extension: extensionIn(FED, "notes/tail"),
      placed: true,
      slot: "feed/panel",
    });
  });

  it("returns the reason a mounted slot drops an extension", () => {
    const host = fixtureHost({ product: FED });

    host.mounted.set(
      new Map([["feed/item", [{ dropped: { "notes/restock": "condition" }, rendered: [] }]]]),
    );

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/restock")).toStrictEqual({
      extension: extensionIn(FED, "notes/restock"),
      placed: false,
      reason: "condition",
      slot: "feed/item",
    });
  });

  it("returns the plugin's reason with an extension a mounted slot drops as off", () => {
    const host = fixtureHost({ product: FED });

    host.availability.set({ feed: { on: true }, notes: { on: false, reason: "requirement" } });
    host.mounted.set(
      new Map([["feed/panel", [{ dropped: { "notes/tail": "off" }, rendered: [] }]]]),
    );

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/tail")).toStrictEqual({
      extension: extensionIn(FED, "notes/tail"),
      placed: false,
      pluginReason: "requirement",
      reason: "off",
      slot: "feed/panel",
    });
  });

  it("returns moved for an extension the product disabled", () => {
    const product = disabledIn(FED, "notes/lead");
    const { result } = renderHook(() => useExtensionStatuses(), {
      wrapper: wrapperOf(fixtureHost({ product })),
    });

    expect(statusIn(result.current, "notes/lead")).toStrictEqual({
      extension: extensionIn(product, "notes/lead"),
      placed: false,
      reason: "moved",
      slot: "feed/panel",
    });
  });

  it("returns off with the plugin's reason for an extension of a plugin that is not on", () => {
    const host = fixtureHost({ product: FED });

    host.availability.set({ feed: { on: true }, notes: { on: false, reason: "condition" } });

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/tail")).toStrictEqual({
      extension: extensionIn(FED, "notes/tail"),
      placed: false,
      pluginReason: "condition",
      reason: "off",
      slot: "feed/panel",
    });
  });

  it("returns quarantined for a quarantined extension", () => {
    const host = fixtureHost({ product: FED });

    host.quarantine.set(
      new Map<RenderTarget, Quarantined>([
        ["extension:notes/tail", { error: "broken", target: "extension:notes/tail" }],
      ]),
    );

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/tail")?.reason).toBe("quarantined");
  });

  it("returns moved for an extension its mounted slot neither renders nor drops", () => {
    const host = fixtureHost({ product: FED });

    host.mounted.set(new Map([["feed/panel", [{ dropped: {}, rendered: ["notes/lead"] }]]]));

    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    expect(statusIn(result.current, "notes/tail")?.reason).toBe("moved");
  });

  it("returns unmounted for an extension whose slot is not mounted", () => {
    const { result } = renderHook(() => useExtensionStatuses(), {
      wrapper: wrapperOf(fixtureHost({ product: FED })),
    });

    expect(statusIn(result.current, "notes/tail")).toStrictEqual({
      extension: extensionIn(FED, "notes/tail"),
      placed: false,
      reason: "unmounted",
      slot: "feed/panel",
    });
  });

  it("returns unmounted without a slot for an extension around another", () => {
    const { result } = renderHook(() => useExtensionStatuses(), {
      wrapper: wrapperOf(fixtureHost({ product: FED })),
    });

    expect(statusIn(result.current, "notes/chip")).toStrictEqual({
      extension: extensionIn(FED, "notes/chip"),
      placed: false,
      reason: "unmounted",
      slot: undefined,
    });
  });

  it("renders again when a slot mounts", () => {
    const host = fixtureHost({ product: FED });
    const { result } = renderHook(() => useExtensionStatuses(), { wrapper: wrapperOf(host) });

    act(() => {
      host.mounted.set(new Map([["feed/panel", [{ dropped: {}, rendered: ["notes/tail"] }]]]));
    });

    expect(statusIn(result.current, "notes/tail")?.placed).toBe(true);
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useExtensionStatuses())).toThrow(
      "useExtensionStatuses() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
