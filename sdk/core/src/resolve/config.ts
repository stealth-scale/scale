/**
 * Checks each installed plugin's configuration schema and the configuration the product states
 * for it, and settles the configuration a component reads.
 *
 * @remarks
 *   A schema is the plugin's own data, so this module reads it as any value: the shapes check takes
 *   any schema, and the rules here are the ones `defineConfigSchema` writes. A property is required
 *   of the product where the schema requires it and states no default.
 */

import { type ResolveContext } from "#resolve/context.ts";
import { type Report } from "#resolve/problem.ts";
import {
  article,
  exactly,
  isRecord,
  list,
  object,
  optional,
  record,
  tested,
  text,
} from "#resolve/shape.ts";

/**
 * The kinds of value a property takes.
 */
const TYPES = new Set(["boolean", "number", "string"]);

/**
 * Returns true for a boolean, a number or a string.
 *
 * @param value - Any value.
 */
function isScalar(value: unknown): value is boolean | number | string {
  return TYPES.has(typeof value);
}

/**
 * The shape of a configuration schema.
 */
const SCHEMA = object({
  additionalProperties: exactly(false),
  properties: record(
    object({
      default: optional(tested(isScalar, "must be a boolean, a number or a string")),
      description: text,
      type: exactly("boolean", "number", "string"),
    }),
  ),
  required: optional(list(text)),
  type: exactly("object"),
});

/**
 * Returns a schema's properties, or none where it states none.
 *
 * @param schema - The schema, as the contract states it.
 */
function propertiesOf(schema: unknown): Readonly<Record<string, unknown>> {
  const properties = isRecord(schema) ? schema["properties"] : undefined;

  return isRecord(properties) ? properties : {};
}

/**
 * Returns the names a schema requires, or none where it requires none.
 *
 * @param schema - The schema, as the contract states it.
 */
function requiredOf(schema: unknown): readonly unknown[] {
  const required = isRecord(schema) ? schema["required"] : undefined;

  return Array.isArray(required) ? required : [];
}

/**
 * Returns true where a property of a valid type states a default of another type.
 *
 * @param property - The property, as the schema states it.
 */
function mistyped(property: unknown): boolean {
  return (
    isRecord(property) &&
    TYPES.has(String(property["type"])) &&
    isScalar(property["default"]) &&
    typeof property["default"] !== property["type"]
  );
}

/**
 * Checks a configuration schema: an object of typed, described properties and no other, with
 * defaults of their type and required names among them.
 *
 * @param path - Where a fault is reported: `<plugin id>.config`.
 * @param schema - The schema, as the contract states it.
 * @param report - The report the faults go into.
 */
export function checkSchema(path: string, schema: unknown, report: Report): void {
  const properties = propertiesOf(schema);

  SCHEMA(schema, path, report);

  for (const [name, property] of Object.entries(properties)) {
    if (mistyped(property)) {
      report.problem(`${path}.properties.${name}.default`, "is not of the property's type");
    }
  }

  for (const [index, name] of requiredOf(schema).entries()) {
    if (typeof name === "string" && !Object.hasOwn(properties, name)) {
      report.problem(`${path}.required.${String(index)}`, `names ${name}, which is no property`);
    }
  }
}

/**
 * Checks the configuration the product states for one plugin against the plugin's schema.
 *
 * @param path - The configuration's path.
 * @param schema - The schema, or undefined where the plugin states none.
 * @param config - The configuration as the product wrote it.
 * @param report - The report the faults go into.
 */
export function checkValues(
  path: string,
  schema: unknown,
  config: Readonly<Record<string, unknown>>,
  report: Report,
): void {
  const properties = propertiesOf(schema);
  const required = requiredOf(schema);

  for (const [name, property] of Object.entries(properties)) {
    const value = config[name];
    const type = isRecord(property) ? String(property["type"]) : "value";
    const defaulted = isRecord(property) && property["default"] !== undefined;

    if (value === undefined && required.includes(name) && !defaulted) {
      report.problem(`${path}.${name}`, "is required");
    } else if (value !== undefined && typeof value !== type) {
      report.problem(
        `${path}.${name}`,
        `is ${article(typeof value)}, and the property takes ${article(type)}`,
      );
    }
  }

  for (const name of Object.keys(config).filter((one) => !Object.hasOwn(properties, one))) {
    report.problem(`${path}.${name}`, "is not a property the plugin declares");
  }
}

/**
 * Returns the configuration a component reads: the schema's defaults, with the product's values
 * over them.
 *
 * @param schema - The schema, or undefined where the plugin states none.
 * @param config - The configuration as the product wrote it, or undefined.
 */
export function settledConfig(
  schema: unknown,
  config: Readonly<Record<string, boolean | number | string>> | undefined,
): Readonly<Record<string, boolean | number | string>> {
  const defaults: Record<string, boolean | number | string> = {};

  for (const [name, property] of Object.entries(propertiesOf(schema))) {
    const fallback = isRecord(property) ? property["default"] : undefined;

    if (isScalar(fallback)) defaults[name] = fallback;
  }

  return { ...defaults, ...config };
}

/**
 * Checks every installed plugin's configuration schema and the configuration the product states.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkConfig(context: ResolveContext, report: Report): void {
  for (const { contract, options, pluginId } of context.installed.values()) {
    if (contract.config !== undefined) checkSchema(`${pluginId}.config`, contract.config, report);

    checkValues(
      `product.plugins.${pluginId}.config`,
      contract.config,
      options.config ?? {},
      report,
    );
  }
}
