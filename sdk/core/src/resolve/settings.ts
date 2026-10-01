/**
 * Checks every settings section's target, schema, component and migrations, and resolves the
 * settings pages and sections.
 *
 * @remarks
 *   A section's schema states flat properties, each with a default a reader receives before the
 *   person saves a value. A property takes the keywords of its type alone: `enum`, `minLength`,
 *   `maxLength` and `pattern` on a string, `minimum` and `maximum` on a number, and `x-control`
 *   and `x-span` on any. A section without a schema renders the component its manifest maps it to.
 */

import { pluginOf } from "#identifiers.ts";
import { type Declaration, isInstalled, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedSettings } from "#resolve/resolved.ts";
import {
  anything,
  count,
  exactly,
  isRecord,
  list,
  numeric,
  object,
  optional,
  record,
  type Shape,
  tested,
  text,
} from "#resolve/shape.ts";
import { type NumberSetting, type SettingProperty, type StringSetting } from "#settings.ts";

/**
 * Describes a declared settings section.
 */
type SectionDeclaration = Declaration<Declared<"settingsSection">>;

/**
 * Takes a whole number of 0 or more.
 */
const whole = tested(
  (value) => typeof value === "number" && Number.isInteger(value) && value >= 0,
  "must be a whole number of 0 or more",
);

/**
 * The keywords every property takes.
 */
const COMMON = {
  default: anything,
  type: anything,
  "x-control": optional(text),
  "x-span": optional(count),
};

/**
 * The shape of a property of each type.
 */
const PROPERTIES: Readonly<Record<string, Shape>> = {
  boolean: object(COMMON),
  integer: object({ ...COMMON, maximum: optional(numeric), minimum: optional(numeric) }),
  number: object({ ...COMMON, maximum: optional(numeric), minimum: optional(numeric) }),
  string: object({
    ...COMMON,
    enum: optional(list(text)),
    maxLength: optional(whole),
    minLength: optional(whole),
    pattern: optional(text),
  }),
};

/**
 * Returns true where a text compiles as a regular expression with the `u` flag.
 *
 * @param pattern - The text.
 */
function isPattern(pattern: string): boolean {
  try {
    return new RegExp(pattern, "u").source.length > 0;
  } catch {
    return false;
  }
}

/**
 * Returns true where a string is among a string property's choices, within its lengths, and
 * matches its pattern.
 *
 * @param property - The string property, as its schema states it.
 * @param value - A string the property may take.
 */
function acceptsText(property: StringSetting, value: string): boolean {
  return (
    (property.enum?.includes(value) ?? true) &&
    value.length >= (property.minLength ?? 0) &&
    value.length <= (property.maxLength ?? Infinity) &&
    (property.pattern === undefined || new RegExp(property.pattern, "u").test(value))
  );
}

/**
 * Returns true where a number is whole for an integer property and within the property's bounds.
 *
 * @param property - The number or integer property, as its schema states it.
 * @param value - A number the property may take.
 */
function acceptsNumber(property: NumberSetting, value: number): boolean {
  return (
    (property.type === "number" || Number.isInteger(value)) &&
    value >= (property.minimum ?? -Infinity) &&
    value <= (property.maximum ?? Infinity)
  );
}

/**
 * Returns true where a value meets a property's type and its bounds.
 *
 * @param property - The property, as its schema states it.
 * @param value - A stored value or a default, of any type.
 */
export function accepts(property: SettingProperty, value: unknown): boolean {
  if (property.type === "boolean") return typeof value === "boolean";

  if (property.type === "string") return typeof value === "string" && acceptsText(property, value);

  return typeof value === "number" && acceptsNumber(property, value);
}

/**
 * Checks one property of a section's schema: its type, its keywords, its pattern and its default.
 *
 * @param value - The property, as the schema states it.
 * @param path - Its dotted path.
 * @param report - The report the faults go into.
 */
function checkProperty(value: unknown, path: string, report: Report): void {
  const shape = isRecord(value) ? PROPERTIES[String(value["type"])] : undefined;

  if (!isRecord(value) || shape === undefined) {
    report.problem(`${path}.type`, 'must be "boolean", "integer", "number" or "string"');

    return;
  }

  shape(value, path, report);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the shape above checked the type and every keyword of the property
  const property = value as unknown as SettingProperty;

  if (
    property.type === "string" &&
    property.pattern !== undefined &&
    !isPattern(property.pattern)
  ) {
    report.problem(`${path}.pattern`, "is not a regular expression");
  } else if (!Object.hasOwn(value, "default")) {
    report.problem(`${path}.default`, "is required");
  } else if (!accepts(property, property.default)) {
    report.problem(`${path}.default`, "is refused by the property's own schema");
  }
}

/**
 * The shape of a section's schema.
 */
const SCHEMA = object({
  additionalProperties: exactly(false),
  properties: record(checkProperty),
  type: exactly("object"),
});

/**
 * Checks one section's target, and its schema, or its component where it states no schema.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared section.
 * @param report - The report the faults go into.
 */
function checkSection(
  context: ResolveContext,
  declaration: SectionDeclaration,
  report: Report,
): void {
  const { code, name, plugin } = declaration;
  const { schema, target } = declaration.reference;
  const at = pathOf(declaration);

  if (!isInstalled(context, pluginOf(target.id))) {
    report.warning(
      `${at}.target`,
      `names the settings page ${target.id}, whose plugin is not installed`,
    );
  }

  if (schema !== undefined) {
    SCHEMA(schema, `${at}.schema`, report);
  } else if (code.settings?.[name]?.component === undefined) {
    report.problem(
      `${plugin}.code.settings.${name}.component`,
      "is required on a section without a schema",
    );
  }
}

/**
 * Returns the versions a section's migrations read, ascending.
 *
 * @param declaration - The declared section.
 */
function migrationsOf(declaration: SectionDeclaration): readonly number[] {
  const migrations = declaration.code.settings?.[declaration.name]?.migrations ?? {};

  return Object.keys(migrations)
    .map(Number)
    .toSorted((one, other) => one - other);
}

/**
 * Checks a section's migrations: each reads a version below the section's own.
 *
 * @param declaration - The declared section.
 * @param report - The report the faults go into.
 */
function checkMigrations(declaration: SectionDeclaration, report: Report): void {
  const { name, plugin, reference } = declaration;
  const current = reference.schemaVersion ?? 1;

  for (const version of migrationsOf(declaration).filter((one) => one >= current)) {
    report.problem(
      `${plugin}.code.settings.${name}.migrations.${String(version)}`,
      `reads version ${String(version)}, and the section's own is ${String(current)}`,
    );
  }
}

/**
 * Checks every settings section, and resolves every settings page and section.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveSettings(context: ResolveContext, report: Report): ResolvedSettings {
  const sections = declarationsOf(context, "settingsSection");

  for (const declaration of sections) {
    checkSection(context, declaration, report);
    checkMigrations(declaration, report);
  }

  return {
    pages: declarationsOf(context, "settingsPage").map(({ plugin, reference }) => ({
      id: reference.id,
      label: reference.label,
      order: reference.order,
      plugin,
      when: reference.when,
    })),
    sections: sections.map((declaration) => ({
      component: declaration.code.settings?.[declaration.name]?.component !== undefined,
      id: declaration.reference.id,
      label: declaration.reference.label,
      migrations: migrationsOf(declaration),
      order: declaration.reference.order,
      plugin: declaration.plugin,
      schema: declaration.reference.schema,
      schemaVersion: declaration.reference.schemaVersion ?? 1,
      target: declaration.reference.target.id,
      when: declaration.reference.when,
    })),
  };
}
