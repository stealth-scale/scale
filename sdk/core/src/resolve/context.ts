/**
 * Reads a product's installed plugins into the form every check reads: each plugin's contract,
 * manifest and options in install order, and every declared name by kind and qualified id.
 *
 * @remarks
 *   The host's contract is part of every product, so its regions, menus, settings pages and events
 *   are declared names like any plugin's. A name whose plugin is installed but undeclared is a
 *   fault of the references check. A name whose plugin is not installed is a fault of the check of
 *   the area that names it, because that area decides whether it is a problem or a warning.
 */

import { KINDS } from "#assemble.ts";
import { type When } from "#condition.ts";
import { type AnyContract } from "#contract.ts";
import { hostContract } from "#host.ts";
import { HOST } from "#identifiers.ts";
import { type PluginManifest } from "#manifest.ts";
import { type MarkerOptions } from "#marker.ts";
import { type InstalledOptions, type ProductDefinition } from "#product.ts";
import { type Reference, type ReferenceKind } from "#reference.ts";
import { type PluginPackage, type ResolveOptions } from "#resolve/options.ts";

/**
 * Describes one installed plugin as the checks read it.
 */
export interface Installation {
  /**
   * The plugin's contract.
   */
  readonly contract: AnyContract;

  /**
   * The plugin's manifest.
   */
  readonly manifest: PluginManifest;

  /**
   * The product's options for the plugin: its configuration, switch, lock, load and condition.
   */
  readonly options: InstalledOptions;

  /**
   * Id of the plugin, which every path of its faults starts with.
   */
  readonly pluginId: string;
}

/**
 * Describes one declared name: the plugin that declares it, its name and its reference.
 */
export interface Declaration<R extends Reference = MarkerOptions & Reference> {
  /**
   * The code the declaring plugin's manifest maps its names to. Empty for the host's names.
   */
  readonly code: PluginManifest["code"];

  /**
   * The declaring plugin's contract.
   */
  readonly contract: AnyContract;

  /**
   * The name, as the contract lists it.
   */
  readonly name: string;

  /**
   * Id of the plugin that declares it.
   */
  readonly plugin: string;

  /**
   * The reference the contract built, with every member its marker stated.
   */
  readonly reference: R;
}

/**
 * Describes one condition a condition nests, with its dotted path.
 */
export interface Nested {
  /**
   * Dotted path of the condition.
   */
  readonly path: string;

  /**
   * The condition.
   */
  readonly when: When;
}

/**
 * Lists what every check reads.
 */
export interface ResolveContext {
  /**
   * Every declared name, the host's included, grouped by kind, each group in install order.
   */
  readonly byKind: Readonly<Record<ReferenceKind, readonly Declaration[]>>;

  /**
   * Every declared name, the host's included, by `<kind>:<qualified id>`, in install order.
   */
  readonly declared: ReadonlyMap<string, Declaration>;

  /**
   * The product's definition.
   */
  readonly definition: ProductDefinition;

  /**
   * The installed plugins, in install order.
   */
  readonly installations: readonly Installation[];

  /**
   * The first installation of each plugin id.
   */
  readonly installed: ReadonlyMap<string, Installation>;

  /**
   * The catalogues, the namespaces, the day and the hotkey validator the build passed.
   */
  readonly options: ResolveOptions;

  /**
   * Each installed plugin's web package, by plugin id.
   */
  readonly packages: Readonly<Record<string, PluginPackage>>;
}

/**
 * Describes one reference a contract lists, with its kind and its name.
 */
export interface Listed {
  /**
   * The kind of the name.
   */
  readonly kind: ReferenceKind;

  /**
   * The name, as the contract lists it.
   */
  readonly name: string;

  /**
   * The reference.
   */
  readonly reference: MarkerOptions & Reference;
}

/**
 * The member of a contract that lists each kind's references, dotted for the two kinds under
 * `settings`.
 */
export const MEMBERS: Readonly<Record<ReferenceKind, string>> = {
  command: "commands",
  entitlement: "entitlements",
  event: "events",
  extension: "extensions",
  featureFlag: "featureFlags",
  menu: "menus",
  mutation: "mutations",
  permission: "permissions",
  query: "queries",
  resource: "resources",
  role: "roles",
  route: "routes",
  settingsPage: "settings.pages",
  settingsSection: "settings.sections",
  slot: "slots",
};

/**
 * Reads the references a contract lists for one kind.
 */
type Reader = (contract: AnyContract) => Readonly<Record<string, MarkerOptions & Reference>>;

/**
 * The reader of each kind's references.
 */
const READERS: Readonly<Record<ReferenceKind, Reader>> = {
  command: (contract) => contract.commands,
  entitlement: (contract) => contract.entitlements,
  event: (contract) => contract.events,
  extension: (contract) => contract.extensions,
  featureFlag: (contract) => contract.featureFlags,
  menu: (contract) => contract.menus,
  mutation: (contract) => contract.mutations,
  permission: (contract) => contract.permissions,
  query: (contract) => contract.queries,
  resource: (contract) => contract.resources,
  role: (contract) => contract.roles,
  route: (contract) => contract.routes,
  settingsPage: (contract) => contract.settings.pages,
  settingsSection: (contract) => contract.settings.sections,
  slot: (contract) => contract.slots,
};

/**
 * Lists every reference a contract declares, kind by kind in alphabetical order.
 *
 * @param contract - The contract whose references are listed, the host's or a plugin's.
 */
export function listed(contract: AnyContract): readonly Listed[] {
  return KINDS.flatMap((kind) =>
    Object.entries(READERS[kind](contract)).map(([name, reference]) => ({
      kind,
      name,
      reference,
    })),
  );
}

/**
 * Returns the key a declared name is indexed under: `<kind>:<qualified id>`.
 *
 * @param reference - A reference to the name.
 */
export function keyOf(reference: Reference): string {
  return `${reference.kind}:${reference.id}`;
}

/**
 * Returns true where a plugin is installed, the host included.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param pluginId - The id to look up, `host` included.
 */
export function isInstalled(context: ResolveContext, pluginId: string): boolean {
  return pluginId === HOST || context.installed.has(pluginId);
}

/**
 * Returns the dotted path of a declared name: `time-off.routes.request`.
 *
 * @param declaration - The declared name.
 */
export function pathOf(declaration: Declaration): string {
  return `${declaration.plugin}.${MEMBERS[declaration.reference.kind]}.${declaration.name}`;
}

/**
 * Lists a condition and every condition it nests in `allOf`, `anyOf` and `not`, each with its
 * path, the outermost first.
 *
 * @param when - The condition, or undefined for none.
 * @param path - Its dotted path.
 */
export function conditionsIn(when: undefined | When, path: string): readonly Nested[] {
  if (when === undefined) return [];

  const { allOf = [], anyOf = [], not } = when;

  return [
    { path, when },
    ...allOf.flatMap((one, index) => conditionsIn(one, `${path}.allOf.${String(index)}`)),
    ...anyOf.flatMap((one, index) => conditionsIn(one, `${path}.anyOf.${String(index)}`)),
    ...conditionsIn(not, `${path}.not`),
  ];
}

/**
 * Groups the declared names by kind, keeping their order.
 *
 * @param declared - Every declared name, by `<kind>:<qualified id>`.
 */
function byKindOf(
  declared: ReadonlyMap<string, Declaration>,
): Readonly<Record<ReferenceKind, readonly Declaration[]>> {
  const kinds: Record<ReferenceKind, Declaration[]> = {
    command: [],
    entitlement: [],
    event: [],
    extension: [],
    featureFlag: [],
    menu: [],
    mutation: [],
    permission: [],
    query: [],
    resource: [],
    role: [],
    route: [],
    settingsPage: [],
    settingsSection: [],
    slot: [],
  };

  for (const declaration of declared.values()) kinds[declaration.reference.kind].push(declaration);

  return kinds;
}

/**
 * Builds the context the checks read.
 *
 * @param definition - The product's definition.
 * @param packages - Each installed plugin's web package, by plugin id.
 * @param options - The catalogues, the namespaces, the day and the hotkey validator.
 */
export function contextOf(
  definition: ProductDefinition,
  packages: Readonly<Record<string, PluginPackage>>,
  options: ResolveOptions,
): ResolveContext {
  const installations = definition.plugins.map(({ manifest, ...rest }) => ({
    contract: manifest.contract,
    manifest,
    options: rest,
    pluginId: manifest.contract.pluginId,
  }));
  const installed = new Map<string, Installation>();
  const declared = new Map<string, Declaration>();

  for (const installation of installations) {
    if (!installed.has(installation.pluginId)) installed.set(installation.pluginId, installation);
  }

  const sources = [
    { code: {}, contract: hostContract },
    ...[...installed.values()].map(({ contract, manifest }) => ({ code: manifest.code, contract })),
  ];

  for (const { code, contract } of sources) {
    for (const { name, reference } of listed(contract)) {
      const key = keyOf(reference);

      if (!declared.has(key)) {
        declared.set(key, { code, contract, name, plugin: contract.pluginId, reference });
      }
    }
  }

  return {
    byKind: byKindOf(declared),
    declared,
    definition,
    installations,
    installed,
    options,
    packages,
  };
}
