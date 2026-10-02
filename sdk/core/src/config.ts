/**
 * Declares a plugin's configuration: what a product states about the plugin at build.
 *
 * @remarks
 *   The schema is a subset of JSON Schema, and each description is a catalogue key. Any JSON Schema
 *   validator checks a product's configuration against it.
 */

/**
 * Describes one configuration property.
 */
export interface ConfigProperty {
  /**
   * Value where the product states none, of the kind `type` names.
   */
  readonly default?: boolean | number | string | undefined;

  /**
   * Key of the property's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Kind of value the property takes.
   */
  readonly type: "boolean" | "number" | "string";
}

/**
 * Lists the properties of a configuration, by name.
 */
export type ConfigProperties = Readonly<Record<string, ConfigProperty>>;

/**
 * Describes a configuration: an object of the declared properties and no other.
 */
export interface ConfigSchema {
  /**
   * Refuses a property the schema does not declare.
   */
  readonly additionalProperties: false;

  /**
   * The properties, by name.
   */
  readonly properties: ConfigProperties;

  /**
   * Properties a product has to state, by name.
   */
  readonly required?: readonly string[] | undefined;

  /**
   * Marks the configuration as an object.
   */
  readonly type: "object";
}

/**
 * Lists what a schema states beside its properties.
 */
export interface SchemaOptions<R extends string> {
  /**
   * Properties a product has to state, by name. None where left out.
   */
  readonly required?: readonly R[] | undefined;
}

/**
 * Describes the schema `defineConfigSchema` builds, with its properties and required names typed.
 */
export interface DefinedSchema<P extends ConfigProperties, R extends string> extends ConfigSchema {
  /**
   * The properties, as given.
   */
  readonly properties: P;

  /**
   * Properties a product has to state, by name, as given.
   */
  readonly required: readonly R[];
}

/**
 * Types the value of one property by the kind its schema names.
 */
type ValueOf<P extends ConfigProperty> = P["type"] extends "boolean"
  ? boolean
  : P["type"] extends "number"
    ? number
    : string;

/**
 * Describes a property with a default. A reader always receives a value for it.
 */
interface Defaulted {
  /**
   * The default, of the property's kind.
   */
  readonly default: boolean | number | string;
}

/**
 * Lists the names a schema requires.
 */
type RequiredOf<S extends ConfigSchema> =
  NonNullable<S["required"]> extends ReadonlyArray<infer Name extends string> ? Name : never;

/**
 * Types what a component reads through `useConfig(schema)`: a property with a default or a
 * required one is always present, and any other may be undefined.
 */
export type ConfigOf<S extends ConfigSchema> = {
  readonly [Name in keyof S["properties"]]: S["properties"][Name] extends Defaulted
    ? ValueOf<S["properties"][Name]>
    : Name extends RequiredOf<S>
      ? ValueOf<S["properties"][Name]>
      : undefined | ValueOf<S["properties"][Name]>;
};

/**
 * Lists the names a product has to write: required, and without a default.
 */
type Written<S extends ConfigSchema> = {
  [Name in keyof S["properties"]]: Name extends RequiredOf<S>
    ? S["properties"][Name] extends Defaulted
      ? never
      : Name
    : never;
}[keyof S["properties"]];

/**
 * Types what a product writes through `installed`: a required property without a default must be
 * written, and any other may be.
 */
export type ConfigWritten<S extends ConfigSchema> = {
  readonly [Name in Exclude<keyof S["properties"], Written<S>>]?: ValueOf<S["properties"][Name]>;
} & {
  readonly [Name in Extract<keyof S["properties"], Written<S>>]: ValueOf<S["properties"][Name]>;
};

/**
 * Defines a configuration schema. The returned type records each property's kind.
 *
 * @param properties - Each property's kind, description and default, by name.
 * @param options - The names a product has to state. None where left out.
 * @returns A JSON Schema object that admits those properties and no other.
 */
export function defineConfigSchema<
  const P extends ConfigProperties,
  const R extends keyof P & string = never,
>(properties: P, options: SchemaOptions<R> = {}): DefinedSchema<P, R> {
  return {
    additionalProperties: false,
    properties,
    required: options.required ?? [],
    type: "object",
  };
}
