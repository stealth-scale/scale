import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { createEventBus, NESTING } from "#bus/bus.ts";
import { PRODUCT } from "#host/product.fixtures.ts";

describe("createEventBus", () => {
  it("delivers a payload to every subscriber in subscription order", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const received: string[] = [];

    bus.subscribe("billing", "time-off/approved", () => {
      received.push("billing");
    });
    bus.subscribe("payroll", "time-off/approved", () => {
      received.push("payroll");
    });
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(received).toStrictEqual(["billing", "payroll"]);
  });

  it("passes the payload the emitter gave", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.subscribe("billing", "time-off/approved", handler);
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(handler.mock.lastCall).toStrictEqual([{ requestId: "7" }]);
  });

  it("throws on an emit of an event no installed plugin declares", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(() => {
      bus.emit("time-off", "time-off/unknown", {});
    }).toThrow("No installed plugin declares the event time-off/unknown.");
  });

  it("throws on an emit by a plugin other than the declaring one", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(() => {
      bus.emit("billing", "time-off/approved", { requestId: "7" });
    }).toThrow("The plugin billing may not emit time-off/approved: only time-off emits it.");
  });

  it("throws on an emit by the product of an event a plugin emits alone", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(() => {
      bus.emit(undefined, "time-off/approved", { requestId: "7" });
    }).toThrow("The product may not emit time-off/approved: only time-off emits it.");
  });

  it("delivers an emit by any party of an event that states anyone", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.subscribe("payroll", "time-off/opened", handler);
    bus.emit(undefined, "time-off/opened", { id: "7" });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("delivers an emit inside a handler before the handler returns", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const order: string[] = [];

    bus.subscribe("billing", "time-off/approved", () => {
      bus.emit("billing", "time-off/opened", { id: "7" });
      order.push("approved");
    });
    bus.subscribe("payroll", "time-off/opened", () => {
      order.push("opened");
    });
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(order).toStrictEqual(["opened", "approved"]);
  });

  it("runs at most 16 deliveries inside one another", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<() => void>(() => {
      bus.emit("time-off", "time-off/approved", { requestId: "7" });
    });

    bus.subscribe("time-off", "time-off/approved", handler);
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(handler).toHaveBeenCalledTimes(NESTING);
  });

  it("reports event-chain-cut for the emit it drops", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const bus = createEventBus({ events: PRODUCT.events, report });

    bus.subscribe("time-off", "time-off/approved", () => {
      bus.emit("time-off", "time-off/approved", { requestId: "7" });
    });
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(report.mock.calls).toStrictEqual([
      [{ kind: "event-chain-cut", plugin: "time-off", target: "time-off/approved" }],
    ]);
  });

  it("delivers again once the nested deliveries return", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<() => void>();

    bus.subscribe("time-off", "time-off/approved", () => {
      bus.emit("time-off", "time-off/approved", { requestId: "7" });
    });
    bus.emit("time-off", "time-off/approved", { requestId: "7" });
    bus.subscribe("payroll", "time-off/opened", handler);
    bus.emit("time-off", "time-off/opened", { id: "7" });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("hands a sticky event's last payload to a new subscriber", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.emit("time-off", "time-off/opened", { id: "7" });
    bus.emit("time-off", "time-off/opened", { id: "8" });
    bus.subscribe("payroll", "time-off/opened", handler);

    expect(handler.mock.calls).toStrictEqual([[{ id: "8" }]]);
  });

  it("hands nothing to a new subscriber of an event that is not sticky", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.emit("time-off", "time-off/approved", { requestId: "7" });
    bus.subscribe("payroll", "time-off/approved", handler);

    expect(handler).not.toHaveBeenCalled();
  });

  it("reports event-handler-failed under the plugin whose handler throws", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const bus = createEventBus({ events: PRODUCT.events, report });
    const error = new Error("thrown");

    bus.subscribe("billing", "time-off/approved", () => {
      throw error;
    });
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(report.mock.lastCall).toStrictEqual([
      { error, kind: "event-handler-failed", plugin: "billing", target: "time-off/approved" },
    ]);
  });

  it("delivers to the other handlers when one throws", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.subscribe("billing", "time-off/approved", () => {
      throw new Error("thrown");
    });
    bus.subscribe("payroll", "time-off/approved", handler);
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls a handler once per subscription", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.subscribe("billing", "time-off/approved", handler);
    bus.subscribe("billing", "time-off/approved", handler);
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("stops delivering to a subscription that ended", () => {
    const bus = createEventBus({
      events: PRODUCT.events,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const handler = vi.fn<(payload: unknown) => void>();

    bus.subscribe("billing", "time-off/approved", handler)();
    bus.emit("time-off", "time-off/approved", { requestId: "7" });

    expect(handler).not.toHaveBeenCalled();
  });
});
