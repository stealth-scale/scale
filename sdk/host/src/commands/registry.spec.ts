import { describe, expect, it, vi } from "vitest";

import { type CommandRun, type HostApi, type LazyCommand } from "@stealthscale/sdk-core";

import {
  apiOf,
  conditionStores,
  importing,
  moduleOf,
  ROUTED,
} from "#commands/registry.fixtures.ts";
import { createCommandRegistry } from "#commands/registry.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { GRACE } from "#stores/session.fixtures.ts";

describe("createCommandRegistry", () => {
  it("resolves with the result of a command's function", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores: conditionStores(),
    });

    await expect(run("time-off/pick")).resolves.toBe("Ada");
  });

  it("passes the arguments to a command's function", async () => {
    const call = vi.fn<CommandRun<unknown, unknown, unknown>>();
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(moduleOf(call)),
      stores: conditionStores(),
    });

    await run("time-off/approve", { requestId: "7" });

    expect(call.mock.lastCall?.[0]).toStrictEqual({ requestId: "7" });
  });

  it("passes the host's API of the command's plugin", async () => {
    const call = vi.fn<CommandRun<unknown, unknown, unknown>>();
    const hostOf = vi.fn<(pluginId: string) => HostApi>(apiOf);
    const run = createCommandRegistry({
      hostOf,
      matched: () => {},
      product: importing(moduleOf(call)),
      stores: conditionStores(),
    });

    await run("time-off/approve", { requestId: "7" });

    expect(hostOf.mock.lastCall).toStrictEqual(["time-off"]);
  });

  it("runs a needed command through the registry", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores: conditionStores(),
    });

    await expect(run("payroll/summarize")).resolves.toBe("summary for Ada");
  });

  it("rejects a command no installed plugin declares", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores: conditionStores(),
    });

    await expect(run("time-off/unknown")).rejects.toThrow(
      "No installed plugin declares the command time-off/unknown.",
    );
  });

  it("rejects a command whose condition is false", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores: conditionStores(GRACE),
    });

    await expect(run("time-off/approve", { requestId: "7" })).rejects.toThrow(
      "The command time-off/approve cannot run: its condition is false.",
    );
  });

  it("rejects a command whose plugin is off", async () => {
    const stores = conditionStores();
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores,
    });

    stores.availability.set({ ...stores.availability.get(), "time-off": { on: false } });

    await expect(run("time-off/pick")).rejects.toThrow(
      "The command time-off/pick cannot run: its condition is false.",
    );
  });

  it("checks the condition of a needed command", async () => {
    const stores = conditionStores();
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores,
    });

    stores.availability.set({ ...stores.availability.get(), "time-off": { on: false } });

    await expect(run("payroll/summarize")).rejects.toThrow(
      "The command time-off/pick cannot run: its condition is false.",
    );
  });

  it("evaluates a command's condition against the matched routes", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => new Set(["time-off/overview"]),
      product: { ...PRODUCT, commands: [ROUTED] },
      stores: conditionStores(),
    });

    await expect(run("time-off/request")).resolves.toBeUndefined();
  });

  it("imports a command's module once", async () => {
    const importer = vi.fn<LazyCommand>(moduleOf(vi.fn<CommandRun<unknown, unknown, unknown>>()));
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(importer),
      stores: conditionStores(),
    });

    await run("time-off/pick");
    await run("time-off/pick");

    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("imports a module again after a failed import", async () => {
    const importer = vi
      .fn<LazyCommand>(moduleOf(vi.fn<CommandRun<unknown, unknown, unknown>>()))
      .mockRejectedValueOnce(new Error("offline"));
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(importer),
      stores: conditionStores(),
    });

    await expect(run("time-off/pick")).rejects.toThrow("offline");
    await expect(run("time-off/pick")).resolves.toBeUndefined();
  });

  it.each([
    { count: 0, module: {} },
    { count: 2, module: { first: (): number => 1, second: (): number => 2 } },
  ])("rejects a command whose module exports $count functions", async ({ count, module }) => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(() => Promise.resolve(module)),
      stores: conditionStores(),
    });

    await expect(run("time-off/pick")).rejects.toThrow(
      `The module of time-off/pick exports ${String(count)} functions, and a command's module exports one.`,
    );
  });

  it("rejects a command no manifest maps to code", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: { commands: PRODUCT.commands, manifests: {} },
      stores: conditionStores(),
    });

    await expect(run("time-off/pick")).rejects.toThrow(
      "No manifest maps the command time-off/pick to code.",
    );
  });

  it("rejects with the error of a command's function", async () => {
    const error = new Error("refused");
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(moduleOf(() => Promise.reject(error))),
      stores: conditionStores(),
    });

    await expect(run("time-off/pick")).rejects.toBe(error);
  });

  it("measures a run under the command's id", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: PRODUCT,
      stores: conditionStores(),
    });

    performance.clearMeasures();
    await run("time-off/pick");

    expect(performance.getEntriesByName("stealth:command:time-off/pick", "measure")).toHaveLength(
      1,
    );
  });

  it("measures a run whose function rejects", async () => {
    const run = createCommandRegistry({
      hostOf: apiOf,
      matched: () => {},
      product: importing(moduleOf(() => Promise.reject(new Error("refused")))),
      stores: conditionStores(),
    });

    performance.clearMeasures();
    await run("time-off/pick").catch(() => {});

    expect(performance.getEntriesByName("stealth:command:time-off/pick", "measure")).toHaveLength(
      1,
    );
  });
});
