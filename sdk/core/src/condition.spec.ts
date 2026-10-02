import { describe, expect, expectTypeOf, it } from "vitest";

import {
  APPROVE,
  CALENDAR,
  contextOf,
  FALSE,
  LAYOUT,
  MODULE,
  OVERVIEW,
  READ,
  TRUE,
} from "#condition.fixtures.ts";
import { conditionContext, evaluateWhen, flagIs, type VariantCondition } from "#condition.ts";
import { NOBODY } from "#session.ts";

describe("condition", () => {
  it("returns true for an absent condition", () => {
    expect(evaluateWhen(undefined, contextOf())).toBe(true);
  });

  it("returns true for a condition that states no member", () => {
    expect(evaluateWhen({}, contextOf())).toBe(true);
  });

  it.each(TRUE)("returns true for %s", (_label, when) => {
    expect(evaluateWhen(when, contextOf())).toBe(true);
  });

  it.each(FALSE)("returns false for %s", (_label, when) => {
    expect(evaluateWhen(when, contextOf())).toBe(false);
  });

  it("returns true for an empty allOf", () => {
    expect(evaluateWhen({ allOf: [] }, contextOf())).toBe(true);
  });

  it("returns false where one of two stated members is false", () => {
    expect(evaluateWhen({ entitlement: MODULE, permission: APPROVE }, contextOf())).toBe(false);
  });

  it("returns false for a route where no location applies", () => {
    expect(evaluateWhen({ route: OVERVIEW }, contextOf({ matched: undefined }))).toBe(false);
  });

  it("returns false for a field where no record applies", () => {
    expect(
      evaluateWhen({ field: { equals: 0, path: "stock" } }, contextOf({ field: undefined })),
    ).toBe(false);
  });

  it("builds a variant condition from an experiment", () => {
    expect(flagIs(LAYOUT, "board")).toStrictEqual({ flag: "time-off/layout", is: "board" });

    expectTypeOf(flagIs<"board" | "list">)
      .parameter(1)
      .toEqualTypeOf<"board" | "list">();
    expectTypeOf(flagIs(LAYOUT, "list")).toEqualTypeOf<VariantCondition>();
  });

  it("reads the permissions and the entitlements from the session", () => {
    const context = conditionContext(
      { ...NOBODY, authenticated: true, entitlements: [MODULE.id], permissions: [READ.id] },
      { flag: () => false, matched: undefined, on: () => true },
    );

    expect([context.permitted(READ.id), context.permitted(APPROVE.id)]).toStrictEqual([
      true,
      false,
    ]);
    expect([context.entitled(MODULE.id), context.entitled("time-off/halfDays")]).toStrictEqual([
      true,
      false,
    ]);
    expect(context.authenticated).toBe(true);
  });

  it("passes the lookups beside the session through", () => {
    const matched = new Set([OVERVIEW.id]);
    const context = conditionContext(NOBODY, {
      flag: (id) => id === CALENDAR.id,
      matched,
      on: (pluginId) => pluginId === "identity",
    });

    expect(evaluateWhen({ featureFlag: CALENDAR, plugin: { pluginId: "identity" } }, context)).toBe(
      true,
    );
    expect(context.matched).toBe(matched);
  });
});
