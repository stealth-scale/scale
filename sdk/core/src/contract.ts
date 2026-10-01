/**
 * Defines the shape of a plugin's contract: the names a definition declares per kind, and the
 * references a defined contract returns for them.
 *
 * @remarks
 *   A reference contains the qualified id, the kind, the contract's version and the members its
 *   marker stated. A plugin that imports another plugin's contract reads every declared name with
 *   its types, and loads none of that plugin's code.
 */

import {
  type EntitlementMarker,
  type PermissionMarker,
  type ResourceMarker,
  type RoleMarker,
} from "#access.ts";
import { type CommandMarker, type EventMarker } from "#command.ts";
import { type ConfigSchema } from "#config.ts";
import { type MutationMarker, type QueryMarker } from "#data.ts";
import { type FlagMarker } from "#flag.ts";
import { type QualifiedId, type Reference, type ReferenceKind } from "#reference.ts";
import { type MenuReference, type RouteMarker } from "#route.ts";
import { type SettingsDefinition } from "#settings.ts";
import { type ExtensionMarker, type SlotMarker } from "#slot.ts";
import { type Requirement } from "#version.ts";

/**
 * Lists the names a plugin declares, per kind.
 */
export interface ContractDefinition {
  /**
   * Commands the plugin runs, by name.
   */
  readonly commands?: Readonly<Record<string, CommandMarker<unknown, unknown>>> | undefined;

  /**
   * Schema of what a product states about the plugin at build.
   */
  readonly config?: ConfigSchema | undefined;

  /**
   * Capabilities a tenant is licensed for, by name.
   */
  readonly entitlements?: Readonly<Record<string, EntitlementMarker>> | undefined;

  /**
   * Events the plugin announces, by name.
   */
  readonly events?: Readonly<Record<string, EventMarker<unknown>>> | undefined;

  /**
   * Contributions to slots, routes and other extensions, by name.
   */
  readonly extensions?: Readonly<Record<string, ExtensionMarker>> | undefined;

  /**
   * Feature flags, by name.
   */
  readonly featureFlags?: Readonly<Record<string, FlagMarker>> | undefined;

  /**
   * Menus a route's `navigation` lists the route in.
   */
  readonly menus?: readonly string[] | undefined;

  /**
   * Mutations the plugin runs, by name.
   */
  readonly mutations?: Readonly<Record<string, MutationMarker>> | undefined;

  /**
   * Permissions a person may have, by name: the resource or area, then the action.
   */
  readonly permissions?: Readonly<Record<string, PermissionMarker>> | undefined;

  /**
   * Queries the plugin runs, by name.
   */
  readonly queries?: Readonly<Record<string, QueryMarker>> | undefined;

  /**
   * Plugins the plugin needs, at ranges of their contracts' versions.
   */
  readonly requires?: readonly Requirement[] | undefined;

  /**
   * Kinds of resource a permission is granted on, by name.
   */
  readonly resources?: Readonly<Record<string, ResourceMarker>> | undefined;

  /**
   * Sets of the plugin's own permissions an access service grants as one, by name.
   */
  readonly roles?: Readonly<Record<string, RoleMarker>> | undefined;

  /**
   * Pages, by name.
   */
  readonly routes?: Readonly<Record<string, RouteMarker>> | undefined;

  /**
   * Settings pages the plugin creates, and sections it adds to pages.
   */
  readonly settings?: SettingsDefinition | undefined;

  /**
   * Slots the plugin renders, by name.
   */
  readonly slots?: Readonly<Record<string, SlotMarker>> | undefined;

  /**
   * The contract's version, which is its package's version.
   */
  readonly version?: string | undefined;
}

/**
 * Lists one factory per kind, each returning a reference to a name of the contract being defined:
 * `self.route("detail")`, `self.permission("request.approve")`.
 *
 * @remarks
 *   A reference from `self` contains the qualified id and the kind alone. The contract checks every
 *   name `self` returned against the names the definition declares, once the definition is built.
 */
export type Self<P extends string> = {
  readonly [K in ReferenceKind]: <N extends string>(name: N) => Reference<K, QualifiedId<P, N>>;
};

/**
 * Types what a definition states under one member, or an empty record where it states nothing.
 */
type Member<D, K extends string> = K extends keyof D
  ? NonNullable<D[K]>
  : Readonly<Record<never, never>>;

/**
 * Types the references of one kind: one per name, typed by its marker, with its qualified id.
 */
type References<P extends string, K extends ReferenceKind, M> = {
  readonly [N in keyof M & string]: Omit<M[N], "kind"> & Reference<K, QualifiedId<P, N>>;
};

/**
 * Types the references of the menus a definition lists.
 */
type Menus<P extends string, M> =
  M extends ReadonlyArray<infer Name extends string>
    ? { readonly [N in Name]: MenuReference<QualifiedId<P, N>> }
    : Readonly<Record<never, never>>;

/**
 * Lists a contract's references to its settings pages and sections.
 */
export interface ContractSettings<P extends string, S> {
  /**
   * Settings pages the plugin creates, by name.
   */
  readonly pages: References<P, "settingsPage", Member<S, "pages">>;

  /**
   * Settings sections the plugin adds to pages, by name.
   */
  readonly sections: References<P, "settingsSection", Member<S, "sections">>;
}

/**
 * Describes a defined contract: one reference per declared name and kind, with the plugin id, the
 * requirements, the version and the configuration schema.
 */
export interface Contract<P extends string, D extends ContractDefinition> {
  /**
   * References to the plugin's commands, by name.
   */
  readonly commands: References<P, "command", Member<D, "commands">>;

  /**
   * Schema of what a product states about the plugin. Undefined where the plugin takes none.
   */
  readonly config: "config" extends keyof D ? D["config"] : undefined;

  /**
   * References to the plugin's entitlements, by name.
   */
  readonly entitlements: References<P, "entitlement", Member<D, "entitlements">>;

  /**
   * References to the plugin's events, by name.
   */
  readonly events: References<P, "event", Member<D, "events">>;

  /**
   * References to the plugin's extensions, by name.
   */
  readonly extensions: References<P, "extension", Member<D, "extensions">>;

  /**
   * References to the plugin's feature flags, by name.
   */
  readonly featureFlags: References<P, "featureFlag", Member<D, "featureFlags">>;

  /**
   * References to the plugin's menus, by name.
   */
  readonly menus: Menus<P, Member<D, "menus">>;

  /**
   * References to the plugin's mutations, by name.
   */
  readonly mutations: References<P, "mutation", Member<D, "mutations">>;

  /**
   * References to the plugin's permissions, by name.
   */
  readonly permissions: References<P, "permission", Member<D, "permissions">>;

  /**
   * Id of the plugin.
   */
  readonly pluginId: P;

  /**
   * References to the plugin's queries, by name.
   */
  readonly queries: References<P, "query", Member<D, "queries">>;

  /**
   * Plugins the plugin needs. Empty where it needs none.
   */
  readonly requires: readonly Requirement[];

  /**
   * References to the plugin's resource kinds, by name.
   */
  readonly resources: References<P, "resource", Member<D, "resources">>;

  /**
   * References to the plugin's roles, by name.
   */
  readonly roles: References<P, "role", Member<D, "roles">>;

  /**
   * References to the plugin's routes, by name.
   */
  readonly routes: References<P, "route", Member<D, "routes">>;

  /**
   * References to the plugin's settings pages and sections.
   */
  readonly settings: ContractSettings<P, Member<D, "settings">>;

  /**
   * References to the plugin's slots, by name.
   */
  readonly slots: References<P, "slot", Member<D, "slots">>;

  /**
   * The contract's version. Undefined where the definition states none.
   */
  readonly version: "version" extends keyof D ? D["version"] : undefined;
}

/**
 * Describes any contract: the form `definePlugin`, `installed` and the resolver accept.
 */
export type AnyContract = Contract<string, ContractDefinition>;
