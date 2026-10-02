import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { createPage, toConsole } from "#host/page.ts";

describe("createPage", () => {
  it("adds each entry to the reports store", () => {
    const page = createPage({ report: vi.fn<(entry: HostReport) => void>() });
    const entry: HostReport = { key: "k", kind: "setting-dropped", reason: "r" };

    page.report(entry);

    expect(page.stores.reports.get()).toStrictEqual([entry]);
  });

  it("passes each entry to the receiver", () => {
    const receiver = vi.fn<(entry: HostReport) => void>();
    const page = createPage({ report: receiver });
    const entry: HostReport = { key: "k", kind: "setting-dropped", reason: "r" };

    page.report(entry);

    expect(receiver.mock.lastCall).toStrictEqual([entry]);
  });

  it("writes to the console without a receiver", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const entry: HostReport = { key: "k", kind: "setting-dropped", reason: "r" };

    createPage({}).report(entry);

    expect(warn.mock.lastCall).toStrictEqual(["[host] setting-dropped", entry]);
  });

  it("writes an entry with an error to the console as an error", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const entry: HostReport = { error: new Error("down"), kind: "flags-failed" };

    toConsole(entry);

    expect(error.mock.lastCall).toStrictEqual(["[host] flags-failed", entry]);
  });

  it("quarantines a target after three failed renders", () => {
    const { quarantine } = createPage({ report: vi.fn<(entry: HostReport) => void>() }).stores;

    quarantine.failed("route:time-off/overview", new Error("one"));
    quarantine.failed("route:time-off/overview", new Error("two"));

    expect(quarantine.get().has("route:time-off/overview")).toBe(false);

    quarantine.failed("route:time-off/overview", new Error("three"));

    expect(quarantine.get().has("route:time-off/overview")).toBe(true);
  });

  it("quarantines a target after the failed renders the product states", () => {
    const page = createPage({ quarantineAfter: 1, report: vi.fn<(entry: HostReport) => void>() });

    page.stores.quarantine.failed("route:time-off/overview", new Error("one"));

    expect(page.stores.quarantine.get().has("route:time-off/overview")).toBe(true);
  });
});
