import { describe, expect, it } from "vitest";

import { isRedirect } from "@stealthscale/provider-router";
import { constantSession, NOBODY } from "@stealthscale/sdk-core";

import { billingContract, PRODUCT } from "#host/product.fixtures.ts";
import { evaluatorOf, stoppedBy } from "#routes/evaluate.ts";
import { contextOf } from "#routes/routed.fixtures.tsx";
import {
  CONDITIONED,
  failInvoicesOnce,
  GUARDED,
  STOPPED,
  SWITCHED,
  thrownBy,
} from "#routes/routes.fixtures.ts";
import { pluginOf } from "#stores/availability.fixtures.ts";

const INVOICES = { pluginId: "billing", routeId: "billing/invoices" } as const;

const SIGNED_IN = { ...INVOICES, when: { authenticated: true } } as const;

const PAYROLL = pluginOf("payroll", [{ pluginId: "time-off", range: "^1.0.0" }]);

describe("evaluate", () => {
  it("returns a plugin a switch turned off with its reason", () => {
    expect(stoppedBy("billing", [], { billing: { on: false, reason: "off" } })).toStrictEqual({
      plugin: "billing",
      reason: "off",
    });
  });

  it("returns a plugin its kill switch stopped as unavailable", () => {
    expect(
      stoppedBy("billing", [], { billing: { on: false, reason: "unavailable" } }),
    ).toStrictEqual({ plugin: "billing", reason: "unavailable" });
  });

  it("returns nothing for a plugin whose condition is false", () => {
    expect(
      stoppedBy("billing", [], { billing: { on: false, reason: "condition" } }),
    ).toBeUndefined();
  });

  it("returns nothing for a plugin the availability does not list", () => {
    expect(stoppedBy("billing", [], {})).toBeUndefined();
  });

  it("returns the plugin a requirement waits on", () => {
    const availability = {
      payroll: { on: false, reason: "requirement" },
      "time-off": { on: false, reason: "off" },
    } as const;

    expect(stoppedBy("payroll", [PAYROLL], availability)).toStrictEqual({
      plugin: "time-off",
      reason: "off",
    });
  });

  it("skips a requirement marked optional", () => {
    const payroll = pluginOf("payroll", [
      { optional: true, pluginId: "billing", range: "^1.0.0" },
      { pluginId: "time-off", range: "^1.0.0" },
    ]);
    const availability = {
      billing: { on: false, reason: "off" },
      payroll: { on: false, reason: "requirement" },
      "time-off": { on: false, reason: "unavailable" },
    } as const;

    expect(stoppedBy("payroll", [payroll], availability)).toStrictEqual({
      plugin: "time-off",
      reason: "unavailable",
    });
  });

  it("returns nothing for a requirement whose condition is false", () => {
    const availability = {
      payroll: { on: false, reason: "requirement" },
      "time-off": { on: false, reason: "condition" },
    } as const;

    expect(stoppedBy("payroll", [PAYROLL], availability)).toBeUndefined();
  });

  it("returns nothing on a ring of requirements", () => {
    const ring = [
      pluginOf("payroll", [{ pluginId: "time-off", range: "^1.0.0" }]),
      pluginOf("time-off", [{ pluginId: "payroll", range: "^1.0.0" }]),
    ];
    const availability = {
      payroll: { on: false, reason: "requirement" },
      "time-off": { on: false, reason: "requirement" },
    } as const;

    expect(stoppedBy("payroll", ring, availability)).toBeUndefined();
  });

  it("returns true for a route of a plugin that is on", () => {
    expect(evaluatorOf(PRODUCT)(INVOICES, contextOf())).toBe(true);
  });

  it("throws not found with the plugin and its reason where a switch turned the plugin off", () => {
    const context = contextOf({ product: SWITCHED });

    expect(thrownBy(() => evaluatorOf(SWITCHED)(INVOICES, context))).toStrictEqual({
      data: { plugin: "billing", reason: "off" },
      isNotFound: true,
    });
  });

  it("throws not found with the plugin a requirement of the route's plugin waits on", () => {
    const context = contextOf({ product: STOPPED });
    const runs = { pluginId: "payroll", routeId: "payroll/runs" };

    expect(thrownBy(() => evaluatorOf(STOPPED)(runs, context))).toStrictEqual({
      data: { plugin: "time-off", reason: "off" },
      isNotFound: true,
    });
  });

  it("throws not found without data where the plugin's condition is false", () => {
    const context = contextOf({ product: CONDITIONED });

    expect(thrownBy(() => evaluatorOf(CONDITIONED)(INVOICES, context))).toStrictEqual({
      isNotFound: true,
    });
  });

  it("throws not found with the target for a quarantined route", () => {
    const context = contextOf({ quarantineAfter: 1 });

    failInvoicesOnce(context.host);

    expect(thrownBy(() => evaluatorOf(PRODUCT)(INVOICES, context))).toStrictEqual({
      data: { reason: "quarantined", target: "route:billing/invoices" },
      isNotFound: true,
    });
  });

  it("returns false for a signed-in person whose condition is false", () => {
    const refused = { ...INVOICES, when: { authenticated: false } };

    expect(evaluatorOf(GUARDED)(refused, contextOf({ product: GUARDED }))).toBe(false);
  });

  it("returns false for a signed-in person without a permission the condition requires", () => {
    const permission = billingContract.permissions["invoice.read"];
    const guarded = { ...INVOICES, when: { allOf: [{ authenticated: true }, { permission }] } };
    const context = contextOf({ product: GUARDED });

    expect(evaluatorOf(GUARDED)(guarded, context, { href: "/invoices" })).toBe(false);
  });

  it("redirects a person who is not signed in to the sign-in route with the address", () => {
    const context = contextOf({ product: GUARDED, session: constantSession(NOBODY) });
    const thrown = thrownBy(() =>
      evaluatorOf(GUARDED)(SIGNED_IN, context, { href: "/invoices?tab=open" }),
    );

    expect(isRedirect(thrown) ? thrown.options : thrown).toStrictEqual({
      search: { redirect: "/invoices?tab=open" },
      statusCode: 307,
      to: "/sign-in",
    });
  });

  it("redirects where a top-level allOf requires sign-in", () => {
    const context = contextOf({ product: GUARDED, session: constantSession(NOBODY) });
    const guarded = { ...INVOICES, when: { allOf: [{ authenticated: true }] } };
    const thrown = thrownBy(() => evaluatorOf(GUARDED)(guarded, context, { href: "/invoices" }));

    expect(isRedirect(thrown) ? thrown.options.to : thrown).toBe("/sign-in");
  });

  it("redirects without an address where no location is given", () => {
    const context = contextOf({ product: GUARDED, session: constantSession(NOBODY) });
    const thrown = thrownBy(() => evaluatorOf(GUARDED)(SIGNED_IN, context));

    expect(isRedirect(thrown) ? thrown.options.search : thrown).toStrictEqual({
      redirect: undefined,
    });
  });

  it("returns false where the condition requires sign-in below its top level", () => {
    const context = contextOf({ product: GUARDED, session: constantSession(NOBODY) });
    const nested = { ...INVOICES, when: { anyOf: [{ authenticated: true }] } };

    expect(evaluatorOf(GUARDED)(nested, context, { href: "/invoices" })).toBe(false);
  });

  it("returns false for a person who is not signed in where the product names no sign-in route", () => {
    const context = contextOf({ session: constantSession(NOBODY) });

    expect(evaluatorOf(PRODUCT)(SIGNED_IN, context, { href: "/invoices" })).toBe(false);
  });
});
