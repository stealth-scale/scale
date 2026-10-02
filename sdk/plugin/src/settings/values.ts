/**
 * Reads a settings section's stored value: parses it, migrates it to the section's version, and
 * checks each property against the section's schema.
 *
 * @remarks
 *   A stored value is `{"version":<n>,"values":{…}}` under the section's key. Every function here
 *   is pure, so the host's settings page and `useSettings` read a value alike.
 */

import {
  type Migration,
  type NumberSetting,
  type ResolvedSettingsSection,
  type SettingProperty,
  type SettingsSchema,
  type StringSetting,
} from "@stealthscale/sdk-core";

/**
 * Describes what a section keeps of its stored value, and why it dropped the rest.
 */
export interface SectionRead {
  /**
   * Why each dropped part of the stored value was dropped: a property, or the whole value.
   */
  readonly dropped: readonly string[];

  /**
   * The stored properties that pass the schema, at the section's version.
   */
  readonly kept: Readonly<Record<string, unknown>>;
}

/**
 * Describes a stored value as it is written.
 */
interface Stored {
  /**
   * The section's values at the version they were written in.
   */
  readonly values: Readonly<Record<string, unknown>>;

  /**
   * The schema version the values were written in.
   */
  readonly version: number;
}

/**
 * The read of a section with no stored value.
 */
const NOTHING: SectionRead = { dropped: [], kept: {} };

/**
 * Returns true for a plain object, which a stored value's `values` is.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns the stored value a section's key contains, or a reason where it is not one.
 */
function storedOf(raw: string): Stored | string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return "the stored value is not JSON";
  }

  return isRecord(parsed) &&
    Number.isInteger(parsed["version"]) &&
    typeof parsed["version"] === "number" &&
    parsed["version"] >= 1 &&
    isRecord(parsed["values"])
    ? { values: parsed["values"], version: parsed["version"] }
    : "the stored value has no version and values";
}

/**
 * Returns a stored value's values at the section's version, or the reason it cannot be migrated:
 * a version no migration reads, or a migration that threw.
 */
function migrated(
  stored: Stored,
  version: number,
  migrations: Readonly<Record<number, Migration>>,
): Readonly<Record<string, unknown>> | string {
  let { values } = stored;

  for (let at = stored.version; at < version; at += 1) {
    const migration = migrations[at];

    if (migration === undefined) return `no migration reads version ${String(at)}`;

    try {
      values = migration(values);
    } catch (error) {
      return `the migration of version ${String(at)} threw: ${String(error)}`;
    }
  }

  return values;
}

/**
 * Returns why a number property refuses a value, or undefined where it accepts it.
 */
function numberRefusal(property: NumberSetting, value: unknown): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return "is not a number";

  if (property.type === "integer" && !Number.isInteger(value)) return "is not a whole number";

  if (property.minimum !== undefined && value < property.minimum) {
    return `is below the minimum ${String(property.minimum)}`;
  }

  return property.maximum !== undefined && value > property.maximum
    ? `is above the maximum ${String(property.maximum)}`
    : undefined;
}

/**
 * Returns why a string property's bounds refuse a value, or undefined where they accept it.
 * Lengths count code points, as JSON Schema counts them.
 */
function lengthRefusal(property: StringSetting, value: string): string | undefined {
  // eslint-disable-next-line typescript/no-misused-spread -- JSON Schema counts a string's length in code points, which the spread yields
  const length = [...value].length;

  if (property.minLength !== undefined && length < property.minLength) {
    return `is shorter than ${String(property.minLength)} characters`;
  }

  return property.maxLength !== undefined && length > property.maxLength
    ? `is longer than ${String(property.maxLength)} characters`
    : undefined;
}

/**
 * Returns why a string property refuses a value, or undefined where it accepts it.
 */
function stringRefusal(property: StringSetting, value: unknown): string | undefined {
  if (typeof value !== "string") return "is not a string";

  if (property.enum !== undefined && !property.enum.includes(value)) {
    return `is not one of ${property.enum.join(", ")}`;
  }

  if (property.pattern !== undefined && !new RegExp(property.pattern, "u").test(value)) {
    return `does not match ${property.pattern}`;
  }

  return lengthRefusal(property, value);
}

/**
 * Returns why a section's schema refuses a property's value, or undefined where it accepts it.
 *
 * @param property - The property the schema declares under the value's name, where it declares
 *   one.
 * @param value - The value written for the property.
 * @returns A phrase that follows the property's name: `is above the maximum 14`.
 */
export function refusalOf(
  property: SettingProperty | undefined,
  value: unknown,
): string | undefined {
  if (property === undefined) return "is not a property of the section";

  if (property.type === "boolean")
    return typeof value === "boolean" ? undefined : "is not a boolean";

  return property.type === "string"
    ? stringRefusal(property, value)
    : numberRefusal(property, value);
}

/**
 * Returns a section's values where nothing is stored: each property's default.
 */
export function defaultsOf(schema?: SettingsSchema): Readonly<Record<string, unknown>> {
  return Object.fromEntries(
    Object.entries(schema?.properties ?? {}).map(([name, property]) => [name, property.default]),
  );
}

/**
 * Returns the values a section's schema accepts, and why it refuses the rest. A section without a
 * schema accepts every value.
 *
 * @param schema - The section's schema, where it states one.
 * @param values - The values by property name: stored ones, or a change.
 */
export function checked(
  schema: SettingsSchema | undefined,
  values: Readonly<Record<string, unknown>>,
): SectionRead {
  if (schema === undefined) return { dropped: [], kept: values };

  const dropped: string[] = [];
  const kept: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(values)) {
    const refusal = refusalOf(schema.properties[name], value);

    if (refusal === undefined) kept[name] = value;
    else dropped.push(`${name} ${refusal}`);
  }

  return { dropped, kept };
}

/**
 * Returns the properties a section keeps of a stored value, and why it drops the rest.
 *
 * @remarks
 *   A value written in a later version, which a rolled-back release leaves, keeps nothing and drops
 *   nothing, so the later release reads it again.
 * @param raw - The text the section's key contains, or null where it contains none.
 * @param section - The section as the build resolved it. Undefined where no installed plugin
 *   declares it.
 * @param migrations - The section's migrations, by the version each reads.
 */
export function readSection(
  raw: null | string,
  section: ResolvedSettingsSection | undefined,
  migrations: Readonly<Record<number, Migration>>,
): SectionRead {
  if (raw === null || section === undefined) return NOTHING;

  const stored = storedOf(raw);

  if (typeof stored === "string") return { dropped: [stored], kept: {} };

  if (stored.version > section.schemaVersion) return NOTHING;

  const values = migrated(stored, section.schemaVersion, migrations);

  return typeof values === "string"
    ? { dropped: [values], kept: {} }
    : checked(section.schema, values);
}
