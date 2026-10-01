import { type ConditionContext, type When } from "#condition.ts";
import { type FlagReference } from "#flag.ts";
import { type Reference } from "#reference.ts";

export const READ: Reference<"permission"> = { id: "time-off/request.read", kind: "permission" };

export const APPROVE: Reference<"permission"> = {
  id: "time-off/request.approve",
  kind: "permission",
};

export const MODULE: Reference<"entitlement"> = { id: "time-off/module", kind: "entitlement" };

export const HALF_DAYS: Reference<"entitlement"> = {
  id: "time-off/halfDays",
  kind: "entitlement",
};

export const CALENDAR: FlagReference<boolean> = { id: "time-off/calendar", kind: "featureFlag" };

export const SYNC: FlagReference<boolean> = { id: "time-off/sync", kind: "featureFlag" };

export const LAYOUT: FlagReference<"board" | "list"> = {
  id: "time-off/layout",
  kind: "featureFlag",
};

export const OVERVIEW: Reference<"route"> = { id: "time-off/overview", kind: "route" };

export const SETTINGS: Reference<"route"> = { id: "host/settings", kind: "route" };

export const FLAGS: Readonly<Record<string, boolean | string>> = {
  [CALENDAR.id]: true,
  [LAYOUT.id]: "board",
  [SYNC.id]: false,
};

export const RECORD: Readonly<Record<string, unknown>> = {
  notes: [],
  stock: 0,
  title: "Desk",
};

export function contextOf(overrides: Partial<ConditionContext> = {}): ConditionContext {
  return {
    authenticated: true,
    entitled: (id) => id === MODULE.id,
    field: (path) => RECORD[path],
    flag: (id) => FLAGS[id] ?? false,
    matched: new Set([OVERVIEW.id]),
    on: (pluginId) => pluginId === "identity",
    permitted: (id) => id === READ.id,
    ...overrides,
  };
}

export const TRUE: ReadonlyArray<readonly [string, When]> = [
  ["a signed-in session", { authenticated: true }],
  ["a granted permission", { permission: READ }],
  ["a licensed entitlement", { entitlement: MODULE }],
  ["a flag that is on", { featureFlag: CALENDAR }],
  ["the variant the experiment serves", { variant: { flag: LAYOUT.id, is: "board" } }],
  ["a plugin that is on", { plugin: { pluginId: "identity" } }],
  ["a matched route", { route: OVERVIEW }],
  ["a field equal to its value", { field: { equals: 0, path: "stock" } }],
  ["a present field", { field: { exists: true, path: "title" } }],
  ["an empty list as an absent field", { field: { exists: false, path: "notes" } }],
  ["every condition of allOf", { allOf: [{ permission: READ }, { entitlement: MODULE }] }],
  ["one condition of anyOf", { anyOf: [{ permission: APPROVE }, { permission: READ }] }],
  ["a false condition under not", { not: { permission: APPROVE } }],
];

export const FALSE: ReadonlyArray<readonly [string, When]> = [
  ["a session nobody signed in to", { authenticated: false }],
  ["a permission the session lacks", { permission: APPROVE }],
  ["an entitlement the tenant lacks", { entitlement: HALF_DAYS }],
  ["a flag that is off", { featureFlag: SYNC }],
  ["a variant the experiment does not serve", { variant: { flag: LAYOUT.id, is: "list" } }],
  ["a plugin that is off", { plugin: { pluginId: "billing" } }],
  ["a route that is not matched", { route: SETTINGS }],
  ["a field with another value", { field: { equals: 3, path: "stock" } }],
  ["a field that must be absent", { field: { exists: false, path: "title" } }],
  ["a missing field that must be present", { field: { exists: true, path: "owner" } }],
  ["one false condition of allOf", { allOf: [{ permission: READ }, { permission: APPROVE }] }],
  ["an empty anyOf", { anyOf: [] }],
  ["a true condition under not", { not: { permission: READ } }],
];
