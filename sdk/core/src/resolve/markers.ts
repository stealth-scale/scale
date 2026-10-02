/**
 * Defines the shape of a condition and of each kind's reference, as a defined contract lists them.
 *
 * @remarks
 *   A reference's other members are those its marker stated. A configuration schema, a section's
 *   schema and every sample are the plugin's own data, which the configuration and settings checks
 *   read, so their shapes take any value.
 */

import { type ReferenceKind } from "#reference.ts";
import { type Report } from "#resolve/problem.ts";
import {
  anything,
  binary,
  count,
  date,
  exactly,
  isRecord,
  list,
  type Members,
  numeric,
  object,
  optional,
  record,
  reference,
  type Shape,
  tested,
  text,
} from "#resolve/shape.ts";

/**
 * Takes a value a field condition compares with: a boolean, a number, a string or null.
 */
const comparable = tested(
  (value) => value === null || ["boolean", "number", "string"].includes(typeof value),
  "must be a boolean, a number, a string or null",
);

/**
 * Takes an object with a plugin id, such as a contract.
 */
const named = tested(
  (value) => isRecord(value) && typeof value["pluginId"] === "string",
  "must be an object with a plugin id",
);

/**
 * Takes a Standard Schema validator: an object or a function with a `~standard` object.
 */
const validator = tested(
  (value) =>
    ((typeof value === "object" && value !== null) || typeof value === "function") &&
    "~standard" in value &&
    isRecord(value["~standard"]),
  "must be a Standard Schema validator",
);

/**
 * Takes a flag's value: a boolean, or one of an experiment's variants.
 */
export const flagValue = tested(
  (value) => typeof value === "boolean" || typeof value === "string",
  "must be a boolean or a string",
);

/**
 * Checks a condition and the conditions it nests.
 *
 * @param value - A condition, as a contract or the product states it.
 * @param path - Its path.
 * @param report - The report the faults go into.
 */
export function condition(value: unknown, path: string, report: Report): void {
  CONDITION(value, path, report);
}

/**
 * The shape of a condition.
 */
const CONDITION = object({
  allOf: optional(list(condition)),
  anyOf: optional(list(condition)),
  authenticated: optional(binary),
  entitlement: optional(reference("entitlement")),
  featureFlag: optional(reference("featureFlag")),
  field: optional(object({ equals: optional(comparable), exists: optional(binary), path: text })),
  not: optional(condition),
  permission: optional(reference("permission")),
  plugin: optional(named),
  route: optional(reference("route")),
  variant: optional(object({ flag: text, is: text })),
});

/**
 * Takes an operation of one kind.
 *
 * @param kind - `query` or `mutation`, the kind of the declaration that runs it.
 */
function operation(kind: "mutation" | "query"): Shape {
  return object({ id: text, kind: exactly(kind) });
}

/**
 * The shape of an operation's sample.
 */
const SAMPLE = object({ data: anything, variables: record(anything) });

/**
 * The shape of an extension's target that is every member of a kind.
 */
const EVERY = object({ every: exactly("extension", "route", "slot") });

/**
 * Checks an extension's target: every member of a kind, or a reference to a slot, a route or an
 * extension.
 *
 * @param value - Every member of a kind, or a reference to a slot, a route or an extension.
 * @param path - Its path.
 * @param report - The report the faults go into.
 */
function target(value: unknown, path: string, report: Report): void {
  if (isRecord(value) && Object.hasOwn(value, "every")) EVERY(value, path, report);
  else reference("extension", "route", "slot")(value, path, report);
}

/**
 * The members each kind's reference states beside its id, its kind, its version and its
 * deprecation.
 */
const MARKERS: Readonly<Record<ReferenceKind, Members>> = {
  command: {
    arguments: optional(exactly(true)),
    keys: optional(text),
    label: text,
    result: optional(exactly(true)),
    sample: anything,
    when: optional(condition),
  },
  entitlement: { description: text },
  event: { emit: optional(exactly("anyone", "owner")), sticky: optional(exactly(true)) },
  extension: {
    match: optional(text),
    order: optional(numeric),
    position: exactly("after", "before", "replace", "wrap"),
    required: optional(exactly(true)),
    sample: anything,
    target,
    when: optional(condition),
  },
  featureFlag: {
    default: flagValue,
    description: text,
    expires: optional(date),
    flagKind: exactly("experiment", "ops", "release"),
    type: exactly("boolean", "string"),
    variants: optional(list(text)),
  },
  menu: {},
  mutation: {
    changes: optional(
      list(
        object({
          action: exactly("created", "deleted", "updated"),
          id: optional(text),
          type: reference("resource"),
        }),
      ),
    ),
    operation: operation("mutation"),
    sample: SAMPLE,
  },
  permission: { description: text, resource: optional(reference("resource")) },
  query: {
    decisions: optional(
      list(
        object({
          at: optional(text),
          field: text,
          id: text,
          permission: reference("permission"),
        }),
      ),
    ),
    operation: operation("query"),
    records: optional(
      list(
        object({
          at: optional(text),
          id: text,
          list: optional(exactly(true)),
          type: reference("resource"),
        }),
      ),
    ),
    sample: SAMPLE,
    staleTime: optional(numeric),
  },
  resource: { description: text },
  role: { description: text, permissions: list(reference("permission")) },
  route: {
    data: optional(list(object({ query: reference("query"), variables: optional(list(text)) }))),
    navigation: optional(
      object({ label: text, menu: optional(reference("menu")), order: optional(numeric) }),
    ),
    parent: optional(reference("route")),
    path: text,
    sample: optional(record(text)),
    search: optional(validator),
    when: optional(condition),
  },
  settingsPage: { label: text, order: optional(numeric), when: optional(condition) },
  settingsSection: {
    label: text,
    order: optional(numeric),
    schema: anything,
    schemaVersion: optional(count),
    target: reference("settingsPage"),
    when: optional(condition),
  },
  slot: {
    arity: optional(exactly("one")),
    keyed: optional(exactly(true)),
    record: optional(reference("resource")),
    sample: anything,
  },
};

/**
 * Returns the shape of a contract's reference of one kind.
 *
 * @param kind - The kind of the reference.
 */
export function markerOf(kind: ReferenceKind): Shape {
  return object({
    deprecated: optional(text),
    id: text,
    kind: exactly(kind),
    version: optional(text),
    ...MARKERS[kind],
  });
}
