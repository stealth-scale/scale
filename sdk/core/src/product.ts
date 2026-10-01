/**
 * Declares a product: the plugins it installs, what it states about each, its placements, its flag
 * values and its own identity.
 *
 * @remarks
 *   The build imports the module that exports the definition and resolves it, so every fault in a
 *   product is reported before it is deployed.
 */

import { type When } from "#condition.ts";
import { type ConfigSchema, type ConfigWritten } from "#config.ts";
import { type AnyContract } from "#contract.ts";
import { type SetFlag } from "#flag.ts";
import { type PluginManifest } from "#manifest.ts";
import { type RouteReference } from "#route.ts";
import { type ExtensionReference, type SlotReference } from "#slot.ts";

/**
 * Lists what a product states about one installed plugin, whatever its contract.
 */
export interface InstalledOptions {
  /**
   * The plugin's configuration, as its schema admits it.
   */
  readonly config?: Readonly<Record<string, boolean | number | string>> | undefined;

  /**
   * Imports the plugin's modules before the first render, for a plugin on every page.
   */
  readonly eager?: boolean | undefined;

  /**
   * The switch's state before a person chooses. On where left out.
   */
  readonly enabled?: boolean | undefined;

  /**
   * Keeps the plugin on for everybody, out of every person's reach.
   */
  readonly locked?: boolean | undefined;

  /**
   * Condition under which the whole plugin is available, such as an entitlement or a permission.
   * Available always where it states none.
   */
  readonly when?: undefined | When;
}

/**
 * Describes one installed plugin as `installed` returns it.
 */
export interface InstalledPlugin extends InstalledOptions {
  /**
   * The plugin's manifest, which its web package exports.
   */
  readonly manifest: PluginManifest;
}

/**
 * Types what a product writes as a plugin's configuration, or `never` for a plugin without a
 * schema.
 */
type Written<C extends AnyContract> = C["config"] extends ConfigSchema
  ? ConfigWritten<C["config"]>
  : never;

/**
 * Returns true, as a type, where a product may leave a plugin's configuration out: the plugin has
 * no schema, or its schema requires no property without a default.
 */
type Optional<C extends AnyContract> = C["config"] extends ConfigSchema
  ? Readonly<Record<never, never>> extends ConfigWritten<C["config"]>
    ? true
    : false
  : true;

/**
 * Describes how a product installs one plugin, with the configuration typed by its contract.
 */
export interface Installing<C extends AnyContract> extends Omit<InstalledOptions, "config"> {
  /**
   * The plugin's configuration, as its schema admits it.
   */
  readonly config?: undefined | Written<C>;
}

/**
 * Describes the installation of a plugin whose schema requires a property without a default.
 */
interface Configured<Config> {
  /**
   * The plugin's configuration, with every required property.
   */
  readonly config: Config;
}

/**
 * Types the arguments `installed` takes after the manifest: options that state the configuration
 * where the schema requires a property without a default, and optional options otherwise.
 */
export type Installed<C extends AnyContract> =
  Optional<C> extends true
    ? [options?: Installing<C>]
    : [options: Configured<Written<C>> & Installing<C>];

/**
 * Describes what a product states about one slot: the extensions it adds, removes and orders.
 */
export interface FilledSlot {
  /**
   * Extensions placed in the slot beside their own target. The slot is a region.
   */
  readonly add?: readonly ExtensionReference[] | undefined;

  /**
   * Extensions listed first, in this order.
   */
  readonly order?: readonly ExtensionReference[] | undefined;

  /**
   * Extensions taken out of the slot.
   */
  readonly remove?: readonly ExtensionReference[] | undefined;

  /**
   * The slot.
   */
  readonly slot: SlotReference;
}

/**
 * Describes what one layer of placements states about one slot, by qualified extension ids: the
 * product's resolved placements, or a person's stored ones.
 */
export interface SlotPlacement {
  /**
   * Extensions placed in the slot beside their own target.
   */
  readonly add?: readonly string[] | undefined;

  /**
   * Extensions listed first, in this order.
   */
  readonly order?: readonly string[] | undefined;

  /**
   * Extensions taken out of the slot.
   */
  readonly remove?: readonly string[] | undefined;
}

/**
 * Lists what a product states about extensions everywhere.
 */
export interface ProductExtensions {
  /**
   * Extensions the product leaves out of every slot.
   */
  readonly disabled?: readonly ExtensionReference[] | undefined;
}

/**
 * Describes a product: the plugins it installs and what it states about each.
 */
export interface ProductDefinition {
  /**
   * Extensions the product leaves out everywhere.
   */
  readonly extensions?: ProductExtensions | undefined;

  /**
   * Flag values the product sets over the contracts' defaults, built with `setFlag`.
   */
  readonly featureFlags?: readonly SetFlag[] | undefined;

  /**
   * Key of the product's name in its own catalogue, whose namespace is the product's id.
   */
  readonly name: string;

  /**
   * The installed plugins, each as `installed` returns it, in install order.
   */
  readonly plugins: readonly InstalledPlugin[];

  /**
   * Id of the product: a storage key segment and its catalogue namespace.
   */
  readonly productId: string;

  /**
   * The route a person who is not signed in is sent to.
   */
  readonly signIn?: RouteReference | undefined;

  /**
   * The product's placements, per slot.
   */
  readonly slots?: readonly FilledSlot[] | undefined;

  /**
   * The product's own version, which each build states.
   */
  readonly version: string;

  /**
   * Condition joined into every plugin route's condition but the sign-in route's.
   */
  readonly when?: undefined | When;
}

/**
 * Installs a plugin. The manifest's contract types the configuration.
 *
 * @param manifest - The manifest the plugin's web package exports.
 * @param args - The options, which state the configuration where the schema requires it.
 * @returns The installed plugin, for a product's `plugins`.
 */
export function installed<const M extends PluginManifest>(
  manifest: M,
  ...args: Installed<M["contract"]>
): InstalledPlugin;

/**
 * Installs a plugin.
 *
 * @param manifest - The manifest the plugin's web package exports.
 * @param options - The configuration, the switch, the lock, the eager load and the condition.
 * @returns The installed plugin.
 */
export function installed(
  manifest: PluginManifest,
  options: InstalledOptions = {},
): InstalledPlugin {
  return { ...options, manifest };
}

/**
 * Returns a product's definition. The build imports the module that exports it and resolves it.
 *
 * @param definition - The plugins, the placements, the flag values and the product's identity.
 */
export function defineProduct(definition: ProductDefinition): ProductDefinition {
  return definition;
}
