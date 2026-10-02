/**
 * Declares the settings pages a plugin creates and the sections it adds to them.
 *
 * @remarks
 *   A section's values schema is an object of flat properties. Each property states a default,
 *   which a reader receives until the person saves a value.
 */

import { type When } from "#condition.ts";
import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";

/**
 * Lists the presentation keywords a settings property may state for the form.
 */
interface Presented {
  /**
   * Name of the control the form renders the property with.
   */
  readonly "x-control"?: string | undefined;

  /**
   * Columns the property's field spans in the form's grid.
   */
  readonly "x-span"?: number | undefined;
}

/**
 * Describes a property whose value is true or false.
 */
export interface BooleanSetting extends Presented {
  /**
   * Value where the person stored none.
   */
  readonly default: boolean;

  /**
   * Marks the property as a boolean.
   */
  readonly type: "boolean";
}

/**
 * Describes a property whose value is a number.
 */
export interface NumberSetting extends Presented {
  /**
   * Value where the person stored none.
   */
  readonly default: number;

  /**
   * Largest value the property takes.
   */
  readonly maximum?: number | undefined;

  /**
   * Smallest value the property takes.
   */
  readonly minimum?: number | undefined;

  /**
   * Marks the property as a whole number or a number.
   */
  readonly type: "integer" | "number";
}

/**
 * Describes a property whose value is a string, or one of a list of strings.
 */
export interface StringSetting extends Presented {
  /**
   * Value where the person stored none.
   */
  readonly default: string;

  /**
   * Values the property takes. The form renders them as a choice.
   */
  readonly enum?: readonly string[] | undefined;

  /**
   * Most characters the value has.
   */
  readonly maxLength?: number | undefined;

  /**
   * Fewest characters the value has.
   */
  readonly minLength?: number | undefined;

  /**
   * Regular expression the value matches.
   */
  readonly pattern?: string | undefined;

  /**
   * Marks the property as a string.
   */
  readonly type: "string";
}

/**
 * Lists the kinds of settings property.
 */
export type SettingProperty = BooleanSetting | NumberSetting | StringSetting;

/**
 * Describes the values of a settings section: an object of flat properties and no other.
 */
export interface SettingsSchema {
  /**
   * Refuses a property the schema does not declare.
   */
  readonly additionalProperties: false;

  /**
   * The properties, by name.
   */
  readonly properties: Readonly<Record<string, SettingProperty>>;

  /**
   * Marks the values as an object.
   */
  readonly type: "object";
}

/**
 * Describes a string property that lists the values it takes.
 */
interface Enumerated<Value extends string> {
  /**
   * Values the property takes.
   */
  readonly enum: readonly Value[];
}

/**
 * Types the value of one property: a boolean, a number, a string, or one of an `enum`'s strings.
 */
type ValueOf<P> = P extends BooleanSetting
  ? boolean
  : P extends NumberSetting
    ? number
    : P extends Enumerated<infer Value extends string>
      ? Value
      : string;

/**
 * Records a section's values for the type checker.
 */
interface Typed<Values> {
  /**
   * The values a reader of the section receives.
   */
  readonly values: Values;
}

/**
 * Describes a settings page a plugin creates.
 */
export interface SettingsPageOptions extends MarkerOptions {
  /**
   * Key of the page's title in the plugin's catalogue. The settings menu lists the page under it.
   */
  readonly label: string;

  /**
   * Rank of the page in the settings menu, ascending. Unranked pages follow, sorted by title.
   */
  readonly order?: number | undefined;

  /**
   * Condition under which the page is routed and listed.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a settings page as its marker states it.
 */
export interface SettingsPageMarker extends SettingsPageOptions {
  /**
   * The kind of the marker.
   */
  readonly kind: "settingsPage";
}

/**
 * Points at a settings page a plugin declared.
 */
export interface SettingsPageReference<Id extends string = string>
  extends Partial<SettingsPageOptions>, Reference<"settingsPage", Id> {}

/**
 * Describes a section a plugin adds to a settings page, its own or another plugin's.
 */
export interface SettingsSectionOptions<
  Schema extends SettingsSchema | undefined = undefined,
> extends MarkerOptions {
  /**
   * Key of the section's heading in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Rank of the section on its page, ascending. Unranked sections follow, in install order.
   */
  readonly order?: number | undefined;

  /**
   * JSON Schema of the section's values. A section without one renders a component instead.
   */
  readonly schema?: Schema;

  /**
   * Version of the schema that a stored value records. 1 where left out.
   */
  readonly schemaVersion?: number | undefined;

  /**
   * The page the section renders on.
   */
  readonly target: SettingsPageReference;

  /**
   * Condition under which the section renders.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a settings section as its marker states it, with its values and its schema in the
 * type.
 *
 * @remarks
 *   `Schema` is `undefined` for a section that renders a component, so a manifest that maps no
 *   component to such a section fails to compile.
 */
export interface SettingsSectionMarker<
  Values = Readonly<Record<string, unknown>>,
  Schema extends SettingsSchema | undefined = SettingsSchema | undefined,
> extends SettingsSectionOptions<Schema> {
  /**
   * The section's values, for the type checker alone.
   */
  readonly "~types"?: Typed<Values>;

  /**
   * The kind of the marker.
   */
  readonly kind: "settingsSection";
}

/**
 * Points at a settings section a plugin declared, with its values in the type.
 */
export interface SettingsSectionReference<
  Id extends string = string,
  Values = Readonly<Record<string, unknown>>,
>
  extends
    Partial<SettingsSectionOptions<SettingsSchema | undefined>>,
    Reference<"settingsSection", Id> {
  /**
   * The section's values, for the type checker alone.
   */
  readonly "~types"?: Typed<Values>;
}

/**
 * Types the values of a schema written `as const`, or of a section reference.
 *
 * @remarks
 *   `integer` and `number` are `number`, and a string with `enum` is the union of its values. A
 *   section without a schema has values of any shape. Its component reads them.
 */
export type ValuesOf<T> =
  T extends SettingsSectionReference<string, infer Values>
    ? Values
    : T extends SettingsSchema
      ? { readonly [Name in keyof T["properties"]]: ValueOf<T["properties"][Name]> }
      : Readonly<Record<string, unknown>>;

/**
 * Lists the settings pages and sections a plugin declares.
 */
export interface SettingsDefinition {
  /**
   * Pages the plugin creates, by name.
   */
  readonly pages?: Readonly<Record<string, SettingsPageMarker>> | undefined;

  /**
   * Sections the plugin adds to its own pages or to another plugin's, by name.
   */
  readonly sections?: Readonly<Record<string, SettingsSectionMarker>> | undefined;
}

/**
 * Marks a settings page.
 *
 * @param options - The page's title, its rank in the settings menu and its condition.
 * @returns The marker.
 */
export function settingsPage(options: SettingsPageOptions): SettingsPageMarker {
  return { ...options, kind: "settingsPage" };
}

/**
 * Marks a settings section, with its values typed by its schema.
 *
 * @remarks
 *   The return type takes no part in inference, so a section without a schema keeps `undefined` as
 *   its schema inside a contract's definition.
 * @param options - The heading, the target page, the rank, the condition, and the schema and its
 *   version for a section the form renders.
 * @returns The marker, with the section's values and its schema in its type.
 */
export function settingsSection<const Schema extends SettingsSchema | undefined = undefined>(
  options: SettingsSectionOptions<Schema>,
): NoInfer<SettingsSectionMarker<ValuesOf<Schema>, Schema>> {
  return { ...options, kind: "settingsSection" };
}
