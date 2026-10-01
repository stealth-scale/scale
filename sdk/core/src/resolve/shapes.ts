/**
 * Checks a product's definition, and every installed plugin's manifest and contract, against the
 * shapes their types state.
 *
 * @remarks
 *   The type checker checks each where it is written. A product may install a plugin compiled
 *   against other types, so the build checks the same shapes before any other check reads them,
 *   and stops after the shapes where one is wrong. A contract's members are reported under the
 *   plugin id, `time-off.routes.request.path`, and what the product states about a plugin under
 *   `product.plugins.<plugin id>`.
 */

import { qualify } from "#identifiers.ts";
import { type ReferenceKind } from "#reference.ts";
import { condition, flagValue, markerOf } from "#resolve/markers.ts";
import { type Report } from "#resolve/problem.ts";
import {
  anything,
  binary,
  callable,
  exactly,
  isRecord,
  list,
  object,
  optional,
  record,
  reference,
  type Shape,
  tested,
  text,
} from "#resolve/shape.ts";
import { isCaretRange, isVersion } from "#version.ts";

/**
 * Matches the key of a migration: the version it reads, a whole number of 1 or more.
 */
const MIGRATION = /^[1-9]\d*$/u;

/**
 * Takes a version: three numbers, then an optional prerelease and build metadata.
 */
const version = tested(
  (value) => typeof value === "string" && isVersion(value),
  "must be a version such as 1.4.0",
);

/**
 * Takes a caret range over one, two or three numbers.
 */
const caretRange = tested(
  (value) => typeof value === "string" && isCaretRange(value),
  "must be a caret range such as ^1.4.0",
);

/**
 * The shape of a requirement.
 */
const REQUIREMENT = object({
  optional: optional(exactly(true)),
  pluginId: text,
  range: caretRange,
  version: optional(version),
});

/**
 * Checks a component entry: its component, and the component that renders in its place.
 */
const ENTRY = object({ component: callable, fallback: optional(callable) });

/**
 * Checks the migrations of a settings section, keyed by the version each reads.
 *
 * @param value - Functions by the version each reads, as the manifest states them.
 * @param path - Their path.
 * @param report - The report the faults go into.
 */
function migrations(value: unknown, path: string, report: Report): void {
  record(callable)(value, path, report);

  if (!isRecord(value)) return;

  for (const name of Object.keys(value).filter((one) => !MIGRATION.test(one))) {
    report.problem(`${path}.${name}`, "must be keyed by a whole number of 1 or more");
  }
}

/**
 * Checks a page's code: an importer, or an entry with a component and a fallback.
 *
 * @param value - An importer, or an entry with a component and a fallback.
 * @param path - Its path.
 * @param report - The report the faults go into.
 */
function routeCode(value: unknown, path: string, report: Report): void {
  if (typeof value !== "function") ENTRY(value, path, report);
}

/**
 * The shape of a manifest's code.
 */
const CODE = object({
  commands: optional(
    record(object({ needs: optional(record(reference("command"))), run: callable })),
  ),
  extensions: optional(record(ENTRY)),
  routes: optional(record(routeCode)),
  settings: optional(
    record(object({ component: optional(callable), migrations: optional(migrations) })),
  ),
});

/**
 * Returns the shape of a contract's references of one kind, each with the qualified id of its
 * name.
 *
 * @param pluginId - The plugin the contract declares.
 * @param kind - The kind of the references.
 */
function declaredAs(pluginId: string, kind: ReferenceKind): Shape {
  const marker = markerOf(kind);

  return (value, path, report) => {
    record(marker)(value, path, report);

    if (!isRecord(value)) return;

    for (const [name, entry] of Object.entries(value)) {
      const expected = qualify(pluginId, name);

      if (isRecord(entry) && typeof entry["id"] === "string" && entry["id"] !== expected) {
        report.problem(`${path}.${name}.id`, `must be ${JSON.stringify(expected)}`);
      }
    }
  };
}

/**
 * Returns the shape of a contract.
 *
 * @param pluginId - The plugin the contract declares.
 */
function contractOf(pluginId: string): Shape {
  return object({
    commands: declaredAs(pluginId, "command"),
    config: anything,
    entitlements: declaredAs(pluginId, "entitlement"),
    events: declaredAs(pluginId, "event"),
    extensions: declaredAs(pluginId, "extension"),
    featureFlags: declaredAs(pluginId, "featureFlag"),
    menus: declaredAs(pluginId, "menu"),
    mutations: declaredAs(pluginId, "mutation"),
    permissions: declaredAs(pluginId, "permission"),
    pluginId: text,
    queries: declaredAs(pluginId, "query"),
    requires: list(REQUIREMENT),
    resources: declaredAs(pluginId, "resource"),
    roles: declaredAs(pluginId, "role"),
    routes: declaredAs(pluginId, "route"),
    settings: object({
      pages: declaredAs(pluginId, "settingsPage"),
      sections: declaredAs(pluginId, "settingsSection"),
    }),
    slots: declaredAs(pluginId, "slot"),
    version: optional(version),
  });
}

/**
 * The shape of what a product states about one plugin beside its manifest.
 */
const INSTALLED = object({
  config: optional(record(anything)),
  eager: optional(binary),
  enabled: optional(binary),
  locked: optional(binary),
  manifest: anything,
  when: optional(condition),
});

/**
 * The shape of the product's definition beside its plugins.
 */
const DEFINITION = object({
  extensions: optional(object({ disabled: optional(list(reference("extension"))) })),
  featureFlags: optional(list(object({ flag: text, value: flagValue }))),
  name: text,
  plugins: anything,
  productId: text,
  signIn: optional(reference("route")),
  slots: optional(
    list(
      object({
        add: optional(list(reference("extension"))),
        order: optional(list(reference("extension"))),
        remove: optional(list(reference("extension"))),
        slot: reference("slot"),
      }),
    ),
  ),
  version: text,
  when: optional(condition),
});

/**
 * Returns the plugin id a manifest's contract states, or undefined where it states none.
 *
 * @param manifest - A manifest as the product states it, of any shape.
 */
function pluginIdOf(manifest: unknown): string | undefined {
  const contract = isRecord(manifest) ? manifest["contract"] : undefined;
  const pluginId = isRecord(contract) ? contract["pluginId"] : undefined;

  return typeof pluginId === "string" ? pluginId : undefined;
}

/**
 * Checks one installed plugin: what the product states about it, its manifest and its contract.
 *
 * @param value - The installed plugin.
 * @param path - Its path by index, for a plugin whose id cannot be read.
 * @param report - The report the faults go into.
 */
function checkInstalled(value: unknown, path: string, report: Report): void {
  const manifest = isRecord(value) ? value["manifest"] : undefined;
  const pluginId = pluginIdOf(manifest);

  if (!isRecord(value) || !isRecord(manifest) || pluginId === undefined) {
    report.problem(path, "must be a plugin as installed returns it");

    return;
  }

  INSTALLED(value, `product.plugins.${pluginId}`, report);
  object({ apiVersion: anything, code: anything, contract: anything })(manifest, pluginId, report);
  caretRange(manifest["apiVersion"], `${pluginId}.apiVersion`, report);
  CODE(manifest["code"], `${pluginId}.code`, report);
  contractOf(pluginId)(manifest["contract"], pluginId, report);
}

/**
 * Checks a product's definition, every installed plugin's manifest and every contract against the
 * shapes their types state.
 *
 * @param definition - The definition, as the build imported it.
 * @param report - The report the faults go into.
 */
export function checkShapes(definition: unknown, report: Report): void {
  DEFINITION(definition, "product", report);

  if (!isRecord(definition)) return;

  list(checkInstalled)(definition["plugins"], "product.plugins", report);
}
