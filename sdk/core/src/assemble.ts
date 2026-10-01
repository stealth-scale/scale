/**
 * Builds a contract from its plugin id and its definition, and checks every identifier the
 * definition declares or references.
 *
 * @remarks
 *   The checks run when the contract's module loads, so a contract with a malformed name, or with a
 *   reference to a name it does not declare, fails before any plugin runs. The package's entry does
 *   not export this module: `defineContract` refuses the host's plugin id, and the host's own
 *   contract is built here.
 */

import { type Contract, type ContractDefinition, type Self } from "#contract.ts";
import { isName, isPluginId, qualify } from "#identifiers.ts";
import { type Reference, type ReferenceKind } from "#reference.ts";

/**
 * The word a message uses for each kind of name.
 */
export const WORDS: Readonly<Record<ReferenceKind, string>> = {
  command: "command",
  entitlement: "entitlement",
  event: "event",
  extension: "extension",
  featureFlag: "feature flag",
  menu: "menu",
  mutation: "mutation",
  permission: "permission",
  query: "query",
  resource: "resource",
  role: "role",
  route: "route",
  settingsPage: "settings page",
  settingsSection: "settings section",
  slot: "slot",
};

/**
 * Every kind of name, in the order `WORDS` lists them.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- `WORDS` has one key per kind, which its type requires
export const KINDS = Object.keys(WORDS) as readonly ReferenceKind[];

/**
 * Lists the markers a definition declares, by kind and then by name.
 */
type Declared = Readonly<Record<ReferenceKind, Readonly<Record<string, object>>>>;

/**
 * Describes a name `self` returned a reference to.
 */
interface Named {
  /**
   * The kind of the name.
   */
  readonly kind: ReferenceKind;

  /**
   * The name, as `self` received it.
   */
  readonly name: string;
}

/**
 * Returns the markers a definition lists under one member, or an empty record where it lists none.
 *
 * @param markers - The markers by name, where the definition states the member.
 */
function recordOf(markers: Readonly<Record<string, object>> | undefined): Declared[ReferenceKind] {
  return markers ?? {};
}

/**
 * Returns the markers a definition declares, by kind, with an empty record for a kind it lists
 * none of.
 *
 * @param definition - The names per kind.
 */
function declaredOf(definition: ContractDefinition): Declared {
  const { menus = [], settings = {} } = definition;

  return {
    command: recordOf(definition.commands),
    entitlement: recordOf(definition.entitlements),
    event: recordOf(definition.events),
    extension: recordOf(definition.extensions),
    featureFlag: recordOf(definition.featureFlags),
    menu: Object.fromEntries(menus.map((name) => [name, {}])),
    mutation: recordOf(definition.mutations),
    permission: recordOf(definition.permissions),
    query: recordOf(definition.queries),
    resource: recordOf(definition.resources),
    role: recordOf(definition.roles),
    route: recordOf(definition.routes),
    settingsPage: recordOf(settings.pages),
    settingsSection: recordOf(settings.sections),
    slot: recordOf(definition.slots),
  };
}

/**
 * Returns a `self` whose factories record every name they return a reference to.
 *
 * @param pluginId - The plugin the contract is defined for.
 * @param named - The list each factory records its name in.
 */
function selfOf<P extends string>(pluginId: P, named: Named[]): Self<P> {
  const factories = KINDS.map((kind) => [
    kind,
    (name: string): Reference => {
      named.push({ kind, name });

      return { id: qualify(pluginId, name), kind };
    },
  ]);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- one factory per kind, each returning a reference of its kind
  return Object.fromEntries(factories) as Self<P>;
}

/**
 * Returns true where a definition is a function of `self`.
 *
 * @param definition - The names per kind, or a function of `self` that returns them.
 */
function isDefining<P extends string, D>(
  definition: ((self: Self<P>) => D) | D,
): definition is (self: Self<P>) => D {
  return typeof definition === "function";
}

/**
 * Throws for the first declared name that breaks the grammar of a name.
 *
 * @param pluginId - The plugin the contract is defined for, for the message.
 * @param declared - The markers by kind and name.
 * @throws {@link Error} When a name breaks the grammar.
 */
function checkNames(pluginId: string, declared: Declared): void {
  for (const kind of KINDS) {
    const name = Object.keys(declared[kind]).find((one) => !isName(one));

    if (name !== undefined) {
      throw new Error(
        `The contract ${pluginId} declares the ${WORDS[kind]} ${JSON.stringify(name)}, which ` +
          "breaks the grammar of a name.",
      );
    }
  }
}

/**
 * Throws for the first name `self` returned a reference to that the definition does not declare.
 *
 * @param pluginId - The plugin the contract is defined for, for the message.
 * @param declared - The markers by kind and name.
 * @param named - The names `self` returned references to.
 * @throws {@link Error} When the definition does not declare a name.
 */
function checkSelf(pluginId: string, declared: Declared, named: readonly Named[]): void {
  const missing = named.find(({ kind, name }) => !Object.hasOwn(declared[kind], name));

  if (missing !== undefined) {
    throw new Error(
      `The contract ${pluginId} references its own ${WORDS[missing.kind]} ` +
        `${JSON.stringify(missing.name)}, which it does not declare.`,
    );
  }
}

/**
 * Builds the references of a checked definition.
 *
 * @param pluginId - The plugin the contract is defined for.
 * @param definition - The names per kind.
 * @param declared - The same markers, by kind and name.
 */
function contractOf<P extends string, D extends ContractDefinition>(
  pluginId: P,
  definition: D,
  declared: Declared,
): Contract<P, D> {
  const { config, requires = [], version } = definition;
  const versioned = version === undefined ? {} : { version };

  /**
   * Returns the references of one kind, each with its qualified id and the contract's version.
   *
   * @param kind - The kind of the names.
   */
  const referencesOf = (kind: ReferenceKind): Readonly<Record<string, Reference>> =>
    Object.fromEntries(
      Object.entries(declared[kind]).map(([name, marker]) => [
        name,
        { ...marker, ...versioned, id: qualify(pluginId, name), kind },
      ]),
    );

  const contract = {
    commands: referencesOf("command"),
    config,
    entitlements: referencesOf("entitlement"),
    events: referencesOf("event"),
    extensions: referencesOf("extension"),
    featureFlags: referencesOf("featureFlag"),
    menus: referencesOf("menu"),
    mutations: referencesOf("mutation"),
    permissions: referencesOf("permission"),
    pluginId,
    queries: referencesOf("query"),
    requires,
    resources: referencesOf("resource"),
    roles: referencesOf("role"),
    routes: referencesOf("route"),
    settings: { pages: referencesOf("settingsPage"), sections: referencesOf("settingsSection") },
    slots: referencesOf("slot"),
    version,
  };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the references are built per kind and name from the definition the type maps
  return contract as unknown as Contract<P, D>;
}

/**
 * Builds a contract and checks its identifiers. Takes any plugin id, the host's included.
 *
 * @param pluginId - Lowercase words joined by hyphens, which prefix every qualified id.
 * @param definition - The names per kind, or a function of `self` that returns them.
 * @returns The references per kind and name, with the plugin id, the requirements and the version.
 * @throws {@link Error} When the plugin id or a name breaks its grammar, or when `self` named a
 *   name the definition does not declare.
 */
export function assemble<const P extends string, const D extends ContractDefinition>(
  pluginId: P,
  definition: ((self: Self<P>) => D) | D,
): Contract<P, D> {
  if (!isPluginId(pluginId)) {
    throw new Error(
      `The plugin id ${JSON.stringify(pluginId)} breaks the grammar of a plugin id: 2 to 32 ` +
        "characters of lowercase words joined by hyphens.",
    );
  }

  const named: Named[] = [];
  const defined = isDefining(definition) ? definition(selfOf(pluginId, named)) : definition;
  const declared = declaredOf(defined);

  checkNames(pluginId, declared);
  checkSelf(pluginId, declared, named);

  return contractOf(pluginId, defined, declared);
}
