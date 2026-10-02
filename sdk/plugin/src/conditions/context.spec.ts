import { describe, expect, it, vi } from "vitest";

import { APPROVE } from "#access/access.fixtures.ts";
import { conditionContextOf } from "#conditions/context.ts";
import { BETA, CALENDAR } from "#flags/flags.fixtures.ts";
import { fixtureHost } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";

describe("conditionContextOf", () => {
  it("reads the session's grants", () => {
    const context = conditionContextOf(fixtureHost().runtime.stores);

    expect(context.authenticated).toBe(true);
    expect(context.permitted(APPROVE.id)).toBe(true);
    expect(context.entitled(timeOffContract.entitlements.module.id)).toBe(true);
  });

  it("reads a declared flag's value", () => {
    const host = fixtureHost({ products: { [CALENDAR.id]: true } });

    expect(conditionContextOf(host.runtime.stores).flag(CALENDAR.id)).toBe(true);
  });

  it("returns false for a flag no installed plugin declares", () => {
    expect(conditionContextOf(fixtureHost().runtime.stores).flag(BETA.id)).toBe(false);
  });

  it("returns true for a plugin that is on", () => {
    expect(conditionContextOf(fixtureHost().runtime.stores).on("billing")).toBe(true);
  });

  it("returns false for a plugin that is off", () => {
    const host = fixtureHost();

    host.availability.set({ ...host.availability.get(), billing: { on: false, reason: "off" } });

    expect(conditionContextOf(host.runtime.stores).on("billing")).toBe(false);
  });

  it("returns false for a plugin the product does not install", () => {
    expect(conditionContextOf(fixtureHost().runtime.stores).on("payroll")).toBe(false);
  });

  it("returns true for the host", () => {
    expect(conditionContextOf(fixtureHost().runtime.stores).on("host")).toBe(true);
  });

  it("passes the place through", () => {
    const field = vi.fn<(path: string) => unknown>();
    const matched = new Set([timeOffContract.routes.overview.id]);
    const context = conditionContextOf(fixtureHost().runtime.stores, { field, matched });

    expect(context.field).toBe(field);
    expect(context.matched).toBe(matched);
  });

  it("leaves the place undefined where none is given", () => {
    const context = conditionContextOf(fixtureHost().runtime.stores);

    expect(context.field).toBeUndefined();
    expect(context.matched).toBeUndefined();
  });
});
