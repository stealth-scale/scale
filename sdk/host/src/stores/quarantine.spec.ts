import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { TARGET } from "#stores/quarantine.fixtures.ts";
import { createQuarantineStore } from "#stores/quarantine.ts";

describe("createQuarantineStore", () => {
  it("quarantines a target after the limit of failed renders in a row", () => {
    const store = createQuarantineStore({
      after: 3,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const last = new Error("third");

    store.failed(TARGET, new Error("first"));
    store.failed(TARGET, new Error("second"));
    store.failed(TARGET, last);

    expect(store.get().get(TARGET)).toStrictEqual({ error: last, target: TARGET });
  });

  it("quarantines no target below the limit", () => {
    const store = createQuarantineStore({
      after: 3,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.failed(TARGET, new Error("first"));
    store.failed(TARGET, new Error("second"));

    expect(store.get().size).toBe(0);
  });

  it("reports render-failed for each render that throws", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createQuarantineStore({ after: 3, report });
    const error = new Error("thrown");

    store.failed(TARGET, error);

    expect(report.mock.calls).toStrictEqual([[{ error, kind: "render-failed", target: TARGET }]]);
  });

  it("reports quarantined when it quarantines a target", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createQuarantineStore({ after: 1, report });
    const error = new Error("thrown");

    store.failed(TARGET, error);

    expect(report.mock.lastCall).toStrictEqual([{ error, kind: "quarantined", target: TARGET }]);
  });

  it("counts the failed renders in a row alone", () => {
    const store = createQuarantineStore({
      after: 3,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.failed(TARGET, new Error("first"));
    store.failed(TARGET, new Error("second"));
    store.rendered(TARGET);
    store.failed(TARGET, new Error("third"));

    expect(store.get().size).toBe(0);
  });

  it("quarantines a target once", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createQuarantineStore({ after: 1, report });

    store.failed(TARGET, new Error("first"));
    store.failed(TARGET, new Error("second"));

    expect(report.mock.calls.filter(([entry]) => entry.kind === "quarantined")).toHaveLength(1);
  });

  it("lifts a quarantine on retry", () => {
    const store = createQuarantineStore({
      after: 1,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.failed(TARGET, new Error("thrown"));
    store.retry(TARGET);

    expect(store.get().has(TARGET)).toBe(false);
  });

  it("forgets the failed renders on retry", () => {
    const store = createQuarantineStore({
      after: 2,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.failed(TARGET, new Error("first"));
    store.retry(TARGET);
    store.failed(TARGET, new Error("second"));

    expect(store.get().size).toBe(0);
  });

  it("calls no listener for a retry of a target that is not quarantined", () => {
    const store = createQuarantineStore({
      after: 3,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    store.retry(TARGET);

    expect(listener).not.toHaveBeenCalled();
  });
});
